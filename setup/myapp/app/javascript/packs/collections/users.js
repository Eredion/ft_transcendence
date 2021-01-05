/* import Backbone from 'backbone'
import User from '../models/user.js'

let test = new User();
let UsersCollection = Backbone.Collection.extend({
    url: 'api/users/',
    model: User,

});


let userscol = new UsersCollection();
console.log("antes:"+userscol.length); // returns 0 (expected)
userscol.fetch();
console.log("después:"+userscol.length); // again returns 0 (expected 2)

export default userscol; */