const ArticlesService = require('../src/articles-service')
const knex = require('knex')

describe(`Articles service object`, function(){
    let db; 
    let testArticles = [ 
        {
            id: 1,
            date_published: new Date('2029-01-22T16:28:32.615Z'),
            title: "Frist test post!",
            content: "Lorem ipsum yada yadaLorem amet irure eu velit sit sit."
        },
        {
            id: 2,
            date_published: new Date('2029-02-22T16:28:32.615Z'),
            title:'Second test post!',
            content: 'Laborum nisi et id Lorem deserunt dolor anim dolore.'
        },
        {
            id: 3,
            date_published: new Date('2079-02-22T16:28:32.615Z'),
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

    this.afterEach(() => db('blogful_articles').truncate())

    after(() => db.destroy())

    context(`Given 'blogful_articles' has data`, () => {
        before(() => {
            return db 
                .into('blogful_articles')
                .insert(testArticles)
        })

        it(`getAllArticles() resolves all articles from 'blogul_articles' table`, () => {
            return ArticlesService.getAllArticles(db)
                .then(actual => {
                   expect(actual).to.eql(testArticles.map(article => ({
                        ...article,
                        date_published: new Date(article.date_published)
                    })))
                })
        })
    })

    context(`Given 'blogful_articles' has no data`, () => {
        it(`getAllArticles() resolves an empty array`, () => {
            return ArticlesService.getAllArticles(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })

        it(`insertArticle() inserts a new article and resolves the new article with an 'id'`, () => {
            const newArticle = {
                title: 'Test new title',
                content: 'Test new content',
                date_published: new Date('2020-01-01T00:00:00.000Z')
            }
            return ArticlesService.insertArticle(db, newArticle)
                .then(actual => {
                    expect(actual).to.eql({
                        id:1, 
                        title: newArticle.title,
                        content: newArticle.content, 
                        date_published: newArticle.date_published,
                    })
                })
        })
    })
})

