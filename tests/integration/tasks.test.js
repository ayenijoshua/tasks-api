const request = require('supertest')
const {Task}  = require('../../models/task')
const {User} = require('../../models/user')

let server;

let populateTask = async function(){
    await Task.collection.insertMany([
        {name:'task1'},
        {name:'task2'}
    ])
}

describe('/api/tasks', ()=>{
    beforeEach(()=>{server = require('../../index')})
    afterEach(async ()=>{ 
        await Task.remove({})
        await server.close()
    })

    describe('GET /', ()=>{
        it('should return all tasks', async ()=>{
           await Task.collection.insertMany([
                {name:'task1'},
                {name:'task2'}
            ])
            const res = await request(server).get('/api/tasks') 
            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)
            expect(res.body.some((ele)=>ele.name==='task1')).toBeTruthy()
            expect(res.body.some((ele)=>ele.name==='task2')).toBeTruthy()
        })
    })

    describe('GET /:id', ()=>{
        it('should return a task if valid id is passed', async ()=>{
            await populateTask()

           let res = await request(server).get('/api/tasks')
           const task = res.body[0]

           res = await request(server).get(`/api/tasks/${task._id}`)
           expect(res.status).toBe(200) 
           expect(res.body._id).toBe(task._id)
           expect(res.body).toMatchObject({name:task.name}) 
        })

        it('should return a 404 if invalid id is passed', async ()=>{
            await populateTask()

           res = await request(server).get(`/api/tasks/1`)
           expect(res.status).toBe(404)  
        })
    })

    describe('POST /', ()=>{

        let token
        let name

        const exec =  function(){
          return request(server)
                .post('/api/tasks')
                .set('x-auth-token',token)
                .send({name})
        }

        beforeEach(()=>{
            token =  new User().generateAuthToken()
            name = 'task1'
        })

        it('should return a 401 if the client is not logged in', async ()=>{ 
            const res = await request(server).post('/api/tasks') 
            expect(res.status).toBe(401) 
        })

        it('should return 400 if task is less than 5 characters', async()=>{
            name = '1234'
            const res = await exec()

            expect(res.status).toBe(400) 
        })

        it('should return 400 if task is more than 50 characters', async()=>{
            name = new Array(55).join('a')
            const res = await exec()

            expect(res.status).toBe(400) 
        })

        it('should save the task if valid', async()=>{
            
            const res = await exec()

            expect(res.status).toBe(200) 
        })

        it('should return the task if valid', async()=>{
            
            const res = await exec()

            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name')  
        })
    })
})