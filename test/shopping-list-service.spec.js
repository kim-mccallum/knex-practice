const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe(`Shopping list service object`, function(){
    let db; 
    let testItems = [ 
        {
            id: 1,
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            name: "First test item!",
            price:'21.00',
            category: "Lunch",
            checked: false
        },
        {
            id: 2,
            date_added: new Date('2020-01-22T16:28:32.615Z'),
            name: "Second test item!",
            price:'1.00',
            category: "Lunch",
            checked: false        
        },
        {
            id: 3,
            date_added: new Date('2021-01-22T16:28:32.615Z'),
            name: "Third test item!",
            price:'5.00',
            category: "Lunch",
            checked: false
        },
    ]

    before(() => {
        db = knex({
            client:'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    before(() => db('shopping_list').truncate())

    this.afterEach(() => db('shopping_list').truncate())

    after(() => db.destroy())

    context(`Given 'shopping_list' has data`, () => {
        beforeEach(() => {
            return db 
                .into('shopping_list')
                .insert(testItems)
        })

        it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                   expect(actual).to.eql(testItems.map(item => ({
                        ...item,
                        date_added: item.date_added
                    })))
                })
        })

        it(`getById() resolves an Item by id from 'shopping_list' tables`, () =>{
            const thirdId = 3;
            const thirdTestItem = testItems[thirdId - 1]
            return ShoppingListService.getById(db, thirdId)
                .then(actual => {
                    // console.log(`these match? ${actual.date_added === thirdTestArticle.date_added}`)
                    // console.log(`these match? ${actual.date_added} and ${thirdTestArticle.date_added}`)
                    expect(actual).to.eql({
                        id: thirdId, 
                        name: thirdTestItem.name, 
                        category: thirdTestItem.category, 
                        checked: thirdTestItem.checked,
                        price: thirdTestItem.price,
                        date_added: thirdTestItem.date_added
                    })
                })
        })

        it(`deleteItem() removes an Item by id from 'shopping_list' table`, () => {
            const itemId = 3
            return ShoppingListService.deleteItem(db, itemId)
                //two promises here? Explain
                .then(() => ShoppingListService.getAllItems(db))
                .then(allItems  => {
                    const expected = testItems.filter(item => item.id !== itemId)
                    expect(allItems).to.eql(expected)
                })
        })

        it(`updateItem() updates an article from the 'shopping_list' table`, () => {
            const idOfItemToUpdate = 3
            const newItemData = {
                name: 'updated name',
                category: 'Main',
                price: '21.00',
                checked: true,
                date_added: new Date(),
            }
            return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
                .then(()=> ShoppingListService.getById(db, idOfItemToUpdate))
                .then(item => {
                    expect(item).to.eql({
                        id: idOfItemToUpdate,
                        ...newItemData,
                    })
                })
        })
    })

    context(`Given 'shopping_list' has no data`, () => {
        it(`getAllItems() resolves an empty array`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })

        it(`insertItem() inserts a new item and resolves the new item with an 'id'`, () => {
            const newItem = {
                name: 'Test new name',
                price: '21.00',
                category: 'Main',
                checked:true,
                date_added: new Date('2020-01-01T00:00:00.000Z')
            }
            return ShoppingListService.insertItem(db, newItem)
                .then(actual => {
                    expect(actual).to.eql({
                        // why do I expect the id to be 1?
                        id:1, 
                        name: newItem.name,
                        price: newItem.price,
                        checked: newItem.checked,
                        category: newItem.category, 
                        date_added: new Date (newItem.date_added)
                    })
                })
        })
    })
})
