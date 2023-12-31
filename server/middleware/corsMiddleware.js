function cors(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Origin', 'https://pizza-mern-for-deploy-client.vercel.app');
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
   /*  res.header("Access-Control-Allow-Headers", "Content-Type"); */
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
}

module.exports = cors