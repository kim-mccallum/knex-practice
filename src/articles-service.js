const ArticlesService = {
    getAllArticles(knex){
        return knex.select('*').from('blogful-articles')
    }
}

module.exports = ArticlesService;