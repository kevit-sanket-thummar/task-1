const axios = require('axios');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const baseurl = 'https://jsonplaceholder.typicode.com/';


app.get('', (req, res) => {
    res.send('task 1');
});

app.get('/user', async (req, res) => {
    if(!req.query.username) {
        // console.log('Response= ', req.data)
        return res.send({
            error :'Please provide user name'
        });
    } else {
        try {

            let query = `username=${req.query.username}`;
            const user = await getData('users', query);

            if(user.length === 0) {return res.send('Please provide valid username');}

            // console.log(user);
            // console.log(user)
            
            query = `userId=${user[0].id}`;
            const posts = await getData('posts', query);

            if(posts.length === 0) {return res.send('No Post Found');}
            // console.log(posts);
            // const postComments = getPost(posts);

            // const postResult = await getPost(req.query.userId);
            // res.send(postResult);

            const postsOfUser = await getPost(posts);
            const userDetail = {username:user[0].username,name:user[0].name,email:user[0].email,city:user[0].address.city,posts:postsOfUser}
            // console.log('User Details = ',userDetail)
            res.status(200).send({ 
                status: 'SUCCESS',
                data: userDetail 
            });
        } catch(err) {
            res.send({ error: err.message });
            console.log('Response= ', req.data)
            console.log(err)
        }
    }
})



app.get('/user2', async (req, res) => {
    if(!(req.query.name && req.query.email)){
        return res.send({error:'Please provide a name and email'})
    }else{
        try {
            let query = `name=${req.query.name}&email=${req.query.email}`
            const comments = await getData('comments',query)
            // console.log(comments)


            query = `id=${comments[0].postId}`
            const posts = await getData('posts',query)


            query = `id=${posts[0].userId}`
            const user = await getData('users',query)
            const userDetail= {username:user[0].username,name:user[0].name,email:user[0].email}
            res.send(userDetail)
        } catch (error) {
            console.log(error)
        }
    }
})



// const getUser = async (username) => {

//     return new Promise(async (resolve, reject) => {
//         try {
//             const url = 'https://jsonplaceholder.typicode.com/users?username=' + username;
//             console.log('url = ',url)
//             const result = await axios.get(url)
//             // console.log('Result=',result.data)
//             resolve(result.data)
//         }
//         catch (err) {
//             reject(err)
//         }
//     })
// }


const getData = async (collectionName, query)=>{
  
        try {
            const url = `${baseurl}${collectionName}?${query}`
            console.log('url = ',url)
            const response = await axios.get(url)
            return response.data
        } 
        catch (error) {
            throw error
        }
    
}


// const getPost = async (posts) => {
//     return new Promise(async (resolve, reject) => {
//         try {
           
//             //console.log(posts)
//             // const postsOfUser = []
//             // console.log('posts Count = ', posts.length)
//             // for(let i= 0; i < posts.length; i++){
//             //     let query = `postId=${posts[i].id}`
//             //    // const [{name,body}] = await getData('comments', query)
//             //     const comments  = await getData('comments', query)
//             //     let [{name,body}] = comments[0].data
               
//             //     postsOfUser.push({ title:posts[i].title, comments: [{name,body}]})
//             // }



//             const postsOfUser = []
//             console.log('posts = ',posts.length)
//             for (let i = 0; i < posts.length; i++) {
//                 let query = `postId=${posts[i].id}`
                
//                 const [{name,body}] = await getData('comments',query)
//                 postsOfUser.push({ title:posts[i].title, comments: [{name,body}]})
//             }
//             console.log('postUser =',postsOfUser)
//             resolve(postsOfUser)


//         //     await postResult.data.forEach(async userParticularPost => {
//         //         const comments = await getComments(userParticularPost.id)
//         //       //  console.log('comments = ', comments)
//         //        console.log(`postID = ${userParticularPost.id} Comments  = ${comments}`)
//         //        postsOfUser.push({title:userParticularPost.title,comments:comments.data})
//         //     //    postsOfUser.filter(post => {return post.userId ===users.id})
//         //     //    console.log('postsOfUser =',postsOfUser)
//         //     });
//             console.log('postOfUser=',postsOfUser)
//             resolve(postsOfUser)
//         } catch (error) {
//             reject(error)
//         }
//     })
// }


const getPost = (posts) => {
    return new Promise(async (resolve, reject) => {
        try {
            const postsOfUser = []
            console.log('posts = ',posts.length)
            for (let i = 0; i < posts.length; i++) {
                let query = `postId=${posts[i].id}`
                //const comments = await getData('comments',query)
                //    postsOfUser.push({ title:posts[i].title, comments: comments})
                // const array = comments.map(x=>{
                //     const {name,body}=x;
                //     return {name,body}
                // })
                const comments = await getData('comments',query)

                const array = comments.map(x=>{
                    const {name,body}= x; 
                    return {name,body}
                })
                postsOfUser.push({ title:posts[i].title, comments: array })
            }
            resolve(postsOfUser)
        } catch (err) {
            reject(`Error in getPostsComments = ${err}`)
        }
    })
}





// const getComments = async (postId) => {
//     return new Promise(async (resolve,reject) => {
//         try {
//             const commentsUrl = 'https://jsonplaceholder.typicode.com/comments?postId=' + postId
//             console.log(commentsUrl)
//             const comments = await axios.get(commentsUrl)
//             // console.log('comments = ', comments.data)
//             resolve(comments.data)
//         } catch (error) {
//             reject(error)
//         }
//     })
// }


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})