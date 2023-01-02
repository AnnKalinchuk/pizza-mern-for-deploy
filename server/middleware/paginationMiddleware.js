function paginatedResults(model) {
    return async (req, res, next) => {
    
      const searchTitle = req.query.search || ""

      const page = parseInt(req.query.page)
      const limit = parseInt(req.query.limit)
  
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
  
      const results = {}
  
      if(endIndex < await model.countDocuments().exec()) {
          results.next = {
          page: page + 1,
          limit: limit
        }
      }
    
      if(startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit
        }
      }
      try {
        ///results.totalCount = await model.count()
        //проверить
        /* results.totalPages = Math.ceil(results.totalCount / limit);
        results.lastPage = Math.ceil(results.totalCount / limit) */
        //
        results.results = await model.find({ title: { $regex: searchTitle, $options: "i" } })
                          .limit(limit)
                          .skip(startIndex)
                          .exec()//

        results.totalCount = await model.find({ title: { $regex: searchTitle, $options: "i" } }).count()
        results.totalPages = Math.ceil(results.totalCount / limit);
        results.lastPage = Math.ceil(results.totalCount / limit)
        
        //productsFilter = productsFilter.filter(product => product.title.includes(searchTitle))//
      
        
        //без поиска(фильтрации)
        //results.results = await model.find({}).filter(product => product.title.includes(searchTitle))/*.sort('sizes[0].price')*/.limit(limit).skip(startIndex).exec()
        ///results.results = await model.find()/*.sort('sizes[0].price')*/.limit(limit).skip(startIndex).exec()
        res.paginatedResults = results
        next()
      } catch (e) {
        res.status(500).json({message: e.message})
      }
    }
  }

  module.exports = paginatedResults
  