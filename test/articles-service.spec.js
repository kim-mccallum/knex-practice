const ArticlesService = require('../src/articles-service')
const knex = require('knex')

describe(`Articles service object`, function(){
    let db; 
    let testArticles = [ 
        {
            title: "Frist test post!",
            content: "Lorem ipsum yada yadaLorem amet irure eu velit sit sit."
        },
        {
            title:'Second test post!',
            content: 'Laborum nisi et id Lorem deserunt dolor anim dolore.'
        },
        {
            title:'Third test post!',
            content:'Eiusmod ullamco sit nulla incididunt ad ex veniam aute id officia laborum adipisicing.'
        },
    ]

    before(() => {
        db = knex({
            client:'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    before(() => db('blogful_articles').truncate())

    before(() => {
        return db 
            .into('blogful_articles')
            .insert(testArticles)
    })

    after(() => db.destroy())

    describe(`getAllArticles()`, () => { 
        it(`resolves all articles from 'blogful_articles' table`, () => {
            return ArticlesService.getAllArticles(db)
                .then(actual => {
                    expect(actual).to.eql(testArticles)
                })
        })
    })
})

