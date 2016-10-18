exports.get = (req, res) => {
    res.render('testing',
    {
       scripts: ['/static/react_apps.js']
   }
  )
};
