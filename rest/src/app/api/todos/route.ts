import { NextResponse } from "next/server"

const API_KEY: string | undefined = process.env.DATA_API_KEY 



const DATA_SOURCE_URL = 'https://jsonplaceholder.typicode.com/todos'

export async function GET(request: Request){
    const origin = request.headers.get('origin')
    const todos = await fetch(DATA_SOURCE_URL);
    const todosJson: Todo[] = await todos.json();
    return new NextResponse(JSON.stringify(todosJson),{
        headers:{
            'Access-Control-Allow-Origin': origin || '*',
            'Content-Type': 'application/json'
        }
    })
}

export async function DELETE(request: Request){
    const {id}: Partial<Todo> = await request.json()

    if (!id) {
        return NextResponse.json({"message": "Todo Id Required"})
    }

    await fetch(`${DATA_SOURCE_URL}/${id}`, {
        method: 'DELETE',
        headers:{
            'Content-Type': 'application/json',
            'API-KEY': API_KEY ?? ''
        }
    })

    return NextResponse.json({"message": `Todo ${id} deleted`})
}

export async function POST(request: Request){
    const {userId,title}: Partial<Todo> = await request.json()

    if (!userId || !title) {
        return NextResponse.json({"message": "Missing required data"})
    }

  const res =  await fetch(`${DATA_SOURCE_URL}`, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'API-KEY': API_KEY ?? ''
        },
        body: JSON.stringify({
            userId, title, completed: false
        })
    })

    const newTodo: Todo = await res.json()

    return NextResponse.json(newTodo)
}

export async function PUT(request: Request){
    const {id,userId, title, completed}: Todo = await request.json()

    if (!id || !title || typeof completed !== 'boolean' || !userId) {  
        return NextResponse.json({"message": "Missing required data"})
    }

  const res =  await fetch(`${DATA_SOURCE_URL}/${id}`, {
        method: 'PUT',
        headers:{
            'Content-Type': 'application/json',
            'API-KEY': API_KEY ?? ''
        },
        body: JSON.stringify({
      title, completed, userId
        })
    })

    const updatedTodo: Todo = await res.json()

    return NextResponse.json(updatedTodo)
}