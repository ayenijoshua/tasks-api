const request = require('supertest')
const {User} = require('../../models/user')
const {Task} = require('../../models/task')

describe('auth middlewate', ()=>{

    beforeEach(()=>{server = require('../../index')})
    afterEach(async ()=>{
       await Task.remove({})
       await server.close()
    })

    let token
    let name

    const exec =  ()=>{
          return request(server)
                .post('/api/tasks') 
                .set('x-auth-token',token)
                .send({name})
    }

    beforeEach(()=>{
        token =  new User().generateAuthToken()
        name = 'task1'
    })

    it('should return 401 if token is not provided',async ()=>{
        token = ''
        const res = await exec()
        
        expect(res.status).toBe(401)
    }) 

    it('should return 400 if token is invalid',async ()=>{
        token = null
        const res = await exec()
        
        expect(res.status).toBe(400) 
    })

    it('should return 200 if token is valid',async ()=>{
        const res = await exec()
        
        expect(res.status).toBe(200)  
    })
})