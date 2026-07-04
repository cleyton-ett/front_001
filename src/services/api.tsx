import axios from 'axios'

const api = axios.create({
    baseURL:'https://apiastrobot-j866iniva-user70-s-projects.vercel.app/arte'
})

export default api