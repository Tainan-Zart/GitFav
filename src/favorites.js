import { GithubUser } from "./GithubUser.js"

//classe que vai conter a logica dos dados
 export class Favorites {
  constructor(root) {
   this.root = document.querySelector(root)
   this.load()

  }

  load(){
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

   async add(username){
    try{

    const userExist = this.entries.find(entry => entry.login === username )

    if(userExist){
      throw new Error('Usuário já cadastrado')
    }

    const user = await GithubUser.search(username)
    if(user.login === undefined){
      throw new Error("Usuário não encontrado!")
    }

      this.entries = [user, ...this.entries]
      this.update()

    }catch(error) {
      alert(error.message)
    }
  }

  delete(user){
    const filteredEntries = this.entries.filter(entry => entry.login !== user.login)
  
    this.entries = filteredEntries
    this.update()
    this.save()
  }
}

//classe que vai criar a visualização e eventos do html

export class FavoritesView extends Favorites{
  constructor(root){
    super(root)

    this.tbody = this.root.querySelector('tbody')
    
    this.update()
    this.onadd()
  }

  onadd(){
    const addbutton = this.root.querySelector('.search button')
    addbutton.addEventListener('click', () => {
    const {value} = this.root.querySelector('.search input')

      this.add(value)
      
    })

  }

  update (){
    this.removeAlltr()

    this.entries.forEach(user => {
      const row = this.createRow()
      console.log(row)

      row.querySelector('.users img').src = `https://github.com/${user.login}.png`
      row.querySelector('.users p ').textContent = user.name
      row.querySelector('.users img').alt ='Imagem de ${user.name}'
      row.querySelector('.users a').href = `https://github.com/${user.login}`
      row.querySelector('.users span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').addEventListener('click', () => {
         const is0k = confirm('tem certeza que deseja deletar essa linha?')
        
         if(is0k){
          this.delete(user)
         }
        
      })

      this.tbody.append(row)
    })
  }

  createRow () {
    const tr = document.createElement('tr')

    tr.innerHTML = `
    
        <td class="users">
          <img src="https://github.com/maykbrito.png" alt="imagem de mayk brito">
          <a href="https://github.com/maykbrito" target="_blank">
          <p>Mayk Brito</p>
          <span>maykbrito</span>
          </a>
        </td>
        <td class="repositories">76</td>
        <td class="followers">4333</td>
        <td>
          <button class="remove">Remover</button>
        </td>
    `
    return tr
  }

  removeAlltr(){
    this.tbody.querySelectorAll('tr')
    .forEach((tr) => {
      tr.remove()
    })
  }
}