import axios from 'axios'

axios.defaults.baseURL = 'https://us-central1-v-contact-vue.cloudfunctions.net/'
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
