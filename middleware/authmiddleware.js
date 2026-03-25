const {verfiyToken} = require('../utils/jwtHelper');
const {sendError} = require('../utils/responseHelper');
const{pool} = require('../config/db');

const protect = async (req,res,next) => {
    try{
        let token;

        if (req.headers.authorization && req.headers.authorization.startWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return sendError(res, 'Access denied. No token provided.', '401');
        }
        const decoded = verfiyToken(token);

        const [rows] = await pool.query(
            `SELECT u.id, u.email, u.is_active, r.name as role FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = ?`,
        [decoded.id]
        );

        if (!rows.length){
            return sendError(res, 'Users mot found.', 401);
        }
        if (!rows[0].is_active){
            return sendError(res, "Account is deactivated", 401);
        }
        req.users = rows[0];
        next();
    }catch(error){
        return sendError(res, "Invalid or expired token", 401);
    }
};

module.exports = {protect};