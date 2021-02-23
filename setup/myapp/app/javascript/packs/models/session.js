import _ from 'underscore';
import Backbone from 'backbone'
import Helper from '../Helper.js'

const MySession = {}

if (Helper.logged()) {

    MySession.Model = Backbone.Model.extend({

        idAttribute: null,

        urlRoot: "api/users/" + Helper.userId() + "/mysession",

        initialize() {
            this.update()
        },
        
        async update() {
            await Helper.fetch(this);
        },

        officer_or_owner() {
            if (this.get('guild') != null) {
                if ( (this.get('guild').owner_id == this.get('id')) ) {
                    return true
                } else if ( ( _.indexOf( this.get('guild').officers, this.get('id') ) !== -1 ) ) {
                    return true
                }
            }
            return false
        },

        guild() {
            return this.get('guild')
        },

        id() {
            return this.get('id')
        }
    });

    MySession.data = new MySession.Model
}

export default MySession;
