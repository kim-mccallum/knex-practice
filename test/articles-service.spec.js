const ArticlesService = require('../src/articles-service')
const knex = require('knex')

describe.skip(`Articles service object`, function(){
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
        beforeEach(() => {
            return db 
                .into('blogful_articles')
                .insert(testArticles)
        })

        it(`getAllArticles() resolves all articles from 'blogul_articles' table`, () => {
            return ArticlesService.getAllArticles(db)
                .then(actual => {
                   expect(actual).to.eql(testArticles.map(article => ({
                        ...article,
                        date_published: article.date_published
                    })))
                })
        })

        it(`getById() resolves an article by id from 'blogful_articles' tables`, () =>{
            const thirdId = 3;
            const thirdTestArticle = testArticles[thirdId - 1]
            return ArticlesService.getById(db, thirdId)
                .then(actual => {
                    // console.log(`these match? ${actual.date_published === thirdTestArticle.date_published}`)
                    // console.log(`these match? ${actual.date_published} and ${thirdTestArticle.date_published}`)
                    expect(actual).to.eql({
                        id: thirdId, 
                        title: thirdTestArticle.title, 
                        content: thirdTestArticle.content, 
                        date_published: thirdTestArticle.date_published
                    })
                })
        })

        it(`deleteArticle() removes an article by id from 'blogful_articles' table`, () => {
            const articleId = 3
            return ArticlesService.deleteArticle(db, articleId)
                //two promises here? Explain
                .then(() => ArticlesService.getAllArticles(db))
                .then(allArticles  => {
                    const expected = testArticles.filter(article => article.id !== articleId)
                    expect(allArticles).to.eql(expected)
                })
        })

        it(`updateArticle() updates an article from the 'blogful_articles' table`, () => {
            const idOfArticleToUpdate = 3
            const newArticleData = {
                title: 'updated title',
                content: 'updated content',
                date_published: new Date(),
            }
            return ArticlesService.updateArticle(db, idOfArticleToUpdate, newArticleData)
                .then(()=> ArticlesService.getById(db, idOfArticleToUpdate))
                .then(article => {
                    expect(article).to.eql({
                        id: idOfArticleToUpdate,
                        ...newArticleData,
                    })
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
                        date_published: new Date (newArticle.date_published)
                    })
                })
        })
    })
})

