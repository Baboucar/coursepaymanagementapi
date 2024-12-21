module.exports = function (req, res, next) {
    if (!req.user || !req.user.isQA) {
      return res.status(403).json({ error: 'Access denied. Only QA users are allowed.' });
    }
    next();
  };
  