
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');
// for auto scroll
import Vue from 'vue'
import VueChatScroll from 'vue-chat-scroll'
Vue.use(VueChatScroll);

/// for notifications
import Toaster from 'v-toaster'
import 'v-toaster/dist/v-toaster.css'
Vue.use(Toaster, {timeout: 5000})

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.component('message', require('./components/message.vue'));

const app = new Vue({
    el: '#app',
    data:{
        message:'',
        chat:{
            message:[],
            user:[],
            color:[],
            time:[]
        },
        typing:'',
        numberOfUsers:0
    },
    watch:{
        message(){
            Echo.private('chat')
                .whisper('typing', {
                    name: this.message
                });
        }
    },
    methods:{
        send(){
            if (this.message.length != 0) {
                this.chat.message.push(this.message);
                this.chat.color.push('success');
                this.chat.user.push('you');
                this.chat.time.push(this.getTime());
                axios.post('/send', {
                    message : this.message,
                    chat:this.chat
                })
                    .then(response => {
                        console.log(response);
                        this.message = ''
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        },
        getTime(){
            let time = new Date();
            return time.getHours()+':'+time.getMinutes();
        },
        getOldMessages(){
            axios.get('/getOldMessage')
                .then(response => {
                    console.log(response);
                    if (response.data != '') {
                        this.chat = response.data;
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        },
        deleteSession(){
            axios.delete('/deleteSession')
                .then(response=> this.$toaster.success('Chat history is deleted') );
        }
    },
    mounted(){
        this.getOldMessages();
        Echo.private('chat')
            .listen('ChatEvent', (e) => {
                this.chat.message.push(e.message);
                this.chat.user.push(e.user);
                this.chat.color.push('warning');
                this.chat.time.push(this.getTime());
                axios.post('/saveToSession',{
                    chat : this.chat
                })
                    .then(response => {
                    })
                    .catch(error => {
                        console.log(error);
                    });
                // console.log(e);
            })
            .listenForWhisper('typing', (e) => {
                if (e.name != '') {
                    this.typing = 'typing...'
                }else{
                    this.typing = ''
                }
            })

        Echo.join(`chat`)
            .here((users) => {
                this.numberOfUsers = users.length;
            })
            .joining((user) => {
                this.numberOfUsers += 1;
                // console.log(user);
                this.$toaster.success(user.name+' is joined the chat room');
            })
            .leaving((user) => {
                this.numberOfUsers -= 1;
                this.$toaster.warning(user.name+' is leaved the chat room');
            });
    }
});



/*Vue.component('example-component', require('./components/ExampleComponent.vue'));

Vue.component('chat-comments', require('./components/OrderComment.vue'));
Vue.component('chat-form', require('./components/CommentForm.vue'));

const app = new Vue({
    el: '#app',

    data: {
        comments: [],
        csrf: document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
    },

    created() {
        this.fetchComments();
        Echo.private('comments')
            .listen('CommentSent', (e) => {
                this.comments.push({
                    comment: e.comment.comment,
                    user: e.user,
                    order:e.order
                });
            });
    },

    methods: {
        fetchComments() {
            axios.get('/comments').then(response => {
                this.comments = response.data;
        });
        },


        addComment(comment) {
            this.comments.push(comment);

            axios.post('/comments', comment).then(response => {
                console.log(response.data);
        });
            window.axios.defaults.headers.common = {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                'X-Requested-With': 'XMLHttpRequest'
            };
        }
    }
});*/

