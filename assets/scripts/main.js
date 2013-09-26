(function ($, BB, _) {

  var App = Backbone.View.extend({
    el: "#comments",

    events: {
      'submit .reply': 'sumbitToDatabase',
      'click .score': 'updateUpvote'
    },

    initialize: function() {
      this.$input_author = $('.reply input[name=author]');
      this.$input_message = $('.reply textarea');
      this.$comment_list = $('#comments #comment_list');
      this.$comment_count = $('#comments #comment_count');

      this.listenTo(this.collection, 'add', this.createNewView);
      this.collection.fetch();
    },

    sumbitToDatabase: function(evnt) {
      evnt.preventDefault();
      var _this = this;

      var comment = new CommentModel({
        author: this.$input_author.val(),
        message: this.$input_message.val()
      });

      comment.save();
      this.createNewView();
    },

    updateUpvote: function() {

    },

    createNewView: function(model, collection) {
      this.$comment_count.html(this.collection.length);

      var view = new CommentView({model: model});
      this.$comment_list.append(view.render().el);
    },

    clearAll: function() {
      this.$input_author.val('');
      this.$input_message.val('');
    }
  });

  var CommentModel = Backbone.Model.extend({
    defaults: {
      author: '',
      message: '',
      upvotes: 0,
      dateCommented: ''
    },

    url: 'http://localhost:9090/comments',

    initialize: function() {

    }
  });

  var CommentCollection = Backbone.Collection.extend({
    model: CommentModel,
    url: 'http://localhost:9090/comments',
    initialize: function () {

    }
  });

  var CommentView = Backbone.View.extend({
    tagName: 'li',

    template: $('#comment-template').html(),

    events: {
      'click .delete': 'deleteComment'
    },

    initialize: function() {
      this.listenTo(this.model, 'destroy', this.removeComment);
    },

    deleteComment: function () {
      this.model.destroy({
        wait: true,
        success: function (model, resp, opt) {
          console.log('model destroy success: ', model);
        },
        error: function (model, xhr, opt) {
          console.log('model destroy error: ', model);
        }
      })
    },

    removeComment: function () {
      this.undelegateEvents();
      this.stopListening();
      this.remove();
    },

    render: function() {
      var compiledTemplate = _.template(this.template);
      this.$el.html(compiledTemplate(this.model.toJSON()));
      return this;
    }
  });

  var commentApp = new App({ collection: new CommentCollection() });
})(jQuery, Backbone, _)