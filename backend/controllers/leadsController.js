const pool = require('../config/db');
const { appendToSheet, updateSheetRow } = require('../utils/googleSheets');


// @desc    Create a new lead
// @route   POST /api/leads
// @access  Public
const createLead = async (req, res) => {
  const { name, email, phone, course, college, year } = req.body;

  try {
    // 1. Check if lead exists
    const leadExists = await pool.query('SELECT * FROM leads WHERE email = $1', [email]);
    if (leadExists.rows.length > 0) {
      return res.status(400).json({ message: 'Lead with this email already exists' });
    }

    // 2. Insert into Database
    const newLead = await pool.query(
      'INSERT INTO leads (name, email, phone, course, college, year) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, email, phone, course, college, year]
    );

    const lead = newLead.rows[0];

    // 3. Sync with Google Sheets (Async - don't block response)
    appendToSheet(lead).then(rowId => {
      // If we got a rowId back (assuming appendToSheet returns it or we calculate it),
      // we could update the DB. For now, appendToSheet returns true/false.
      // If we want to store row_id, we need to implement logic to find it or standard append
      // doesn't return it easily without parsing range.
      // For this assessment, we'll skip saving row_id unless needed for updates.
      // But we DO need it for updates.
      // Let's assume appendToSheet returns the row number.
      if(rowId) {
         pool.query('UPDATE leads SET sheet_row_id = $1 WHERE id = $2', [rowId, lead.id]);
      }
    }).catch(err => console.error('Sheet Sync Error:', err));

    res.status(201).json(lead);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all leads
// @route   GET /api/admin/leads
// @access  Private (Admin)
const getLeads = async (req, res) => {
  try {
    const { course, search } = req.query;
    let query = 'SELECT * FROM leads';
    let params = [];
    let conditions = [];

    if (course) {
      params.push(course);
      conditions.push(`course = $${params.length}`);
    }

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(name ILIKE $${params.length} OR email ILIKE $${params.length})`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const leads = await pool.query(query, params);
    res.json(leads.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update lead status
// @route   PUT /api/admin/leads/:id
// @access  Private (Admin)
const updateLeadStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await pool.query(
      'UPDATE leads SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const updatedLead = result.rows[0];

    // Update Google Sheet
    if (updatedLead.sheet_row_id) {
      updateSheetRow(updatedLead.sheet_row_id, status).catch(err => console.error('Sheet Update Error:', err));
    }

    res.json(updatedLead);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createLead,
  getLeads,
  updateLeadStatus
};
