/* Schema of application data, used by rest-mongo to generate objects */

exports.schema = {
  Client: {
    resource: '/clients',
    schema: {
      id: "Client",
      description: "An application obtaining authorization and making " +
                   "protected resource requests.",
      type: "object",

      properties: {
        id: {type: "string"},
        name: {type: "string"},
        secret: {type: "string"},
        redirect_uri: {type: "string"}
      }
    }
  },

  User: {
    resource: '/users',
    schema: {
      id: "User",
      description: "A human resource owner.",
      type: "object",

      properties: {
        id: {type: "string"},
        password: {type: "string"},
        email: {type: "string"},
        confirmed: {type: "integer"} // 1 if registration confirmed
      }
    },
    methods: {
      check_password: function(password, callback, fallback) {
        var config = require('./lib/config_loader').get_config();
        if (config.hash_lib=="bcrypt"){
            var bcrypt = require('./lib/bcrypt');
            bcrypt.check(this.password, password, callback, fallback);
        }
        else if (config.hash_lib=="crypto"){
            var crypto = require("crypto");
            if (this.password == crypto.createHash('sha256').update(password).digest("hex")) callback(true); else callback(false);
        }
      },
      set_password: function(password, callback, fallback) {
          var config = require('./lib/config_loader').get_config();
          var self = this;
          if (config.hash_lib=="bcrypt"){
              bcrypt.hash(password, function(hash) {
                self.password = hash;
                callback();
              }, fallback);
           }
           else if (config.hash_lib=="crypto"){
               var crypto = require("crypto");
               self.password = crypto.createHash('sha256').update(this.password).digest("hex");
               callback();
           }
      }
    }
  },

  Grant: {
    schema: {
      id: "Grant",
      description: "Authorization code: " +
                   "A short-lived token representing the access grant " +
                   "provided by the end-user.  The authorization code is " +
                   "used to obtain an access token and a refresh token",
      type: "object",

      properties: {
        client_id: {type: "string"},
        user_id: {type: "string"},
        code: {type: "string"}, // The code sent to client is: grant.id|grant.code
        time: {type: "integer"}, // timestamp
        redirect_uri: {type: "string"},
        additional_info: {type: "object"}
      }
    }
  },

  Authorization: {
    resource: '/authorizations',
    schema: {
      id: "Authorization",
      description: "Represents an end-user list of roles, " +
                  " given an application (client) and a context.",
      type: "object",

      properties: {
        id: {type: 'string'},
        // We just store the email, as we want to be able to give authorization
        // to users not registered yet.
        email: {type: 'string'},
        client: {'$ref': 'Client'},
        context: {'type': 'string'},
        roles: {type: 'array', items: {type: "string"}}
      }
    }
  }

}

