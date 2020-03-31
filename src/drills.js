require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})

// knexInstance('shopping_list').select('*')
//     .then(result => {
//         console.log(result)
//     });

function searchByName(searchTerm){
    knexInstance
    .select('id','name','price','date_added','checked','category')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => console.log(result))
}

// searchByName('Lettuce');

function getItemsPaginated(pageNumber){
    const productsPerPage = 6;
    const offset = productsPerPage * (pageNumber - 1)
    knexInstance 
        .select('id','name','price','date_added','checked','category')
        .from('shopping_list')
        .limit(productsPerPage)
        .offset(offset)
        .then(result => {
            console.log(result)
        })
}

// getItemsPaginated(2);

function getAllItemsAfterDate(daysAgo){
    // Select rows which have a date_added greater than daysAgo
    knexInstance
        .select('id','name','price','date_added','checked','category')
        .from('shopping_list')
        .where('date_added', '>',
            knexInstance.raw(`now() -'?? days':: INTERVAL`, daysAgo))
        .then(result => {
            console.log(result)
            console.log(result.length)
        })
}

// getAllItemsAfterDate(1)

// I didn't solve this on my own
function getTotalCostByCategory(){
    // select rows grouped by cat and show total price
    knexInstance
        .select('category')
        .sum('price AS total')
        .from('shopping_list')
        .groupBy('category')
        .then(result => {
            console.log('Cost per category:')
            console.log(result)
        })

}

getTotalCostByCategory();