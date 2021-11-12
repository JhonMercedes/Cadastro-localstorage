const KEY_BD = '@filiais'

var listaRegistros = {
    ultimoIdGerado: 0,
    usuarios: []
}


var FILTRO = ''

function gravarBD() {
    localStorage.setItem(KEY_BD, JSON.stringify(listaRegistros))
}

function lerBD() {
    const data = localStorage.getItem(KEY_BD)
    if (data) {
        listaRegistros = JSON.parse(data)
    }
    desenhar()
}

function pesquisar(value){
    FILTRO = value;
    desenhar()
}



function desenhar() {
    const tbody = document.getElementById('listaRegistrosBody')
    if (tbody) {
        var data = listaRegistros.usuarios
        if(FILTRO.trim()){
            FILTRO = FILTRO.replace(/á/i,'a')
            const expReg = eval(`/${FILTRO.trim().replace(/[^\d\w]+/g,'.*')}/i`)
            data = data.filter(usuario => {
                return expReg.test(usuario.nome) || expReg.test(usuario.vlan60) || expReg.test(usuario.vlan61)
            } )
        }
        data = data
            .sort((a, b) => {
                return a.nome < b.nome ? -1 : 1
            })
            .map(usuario => {
                return `<tr>
                    <td>${usuario.id}</td>
                    <td>${usuario.nome}</td>
                    <td>${usuario.vlan60}</td>
                    <td>${usuario.vlan61}</td>
                    <td>
                        <button onclick='visualizar("cadastro",false,${usuario.id})'>Editar</button>
                        <button class='vermelho' onclick='perguntarDeleta(${usuario.id})'>Deletar</button>
                    </td>
                </tr>`
            })
            tbody.innerHTML = data.join('')
    }
}

function insertUsuario(nome, vlan60, vlan61) {
    const id = listaRegistros.ultimoIdGerado + 1;
    listaRegistros.ultimoIdGerado = id;
    listaRegistros.usuarios.push({
        id, nome, vlan60, vlan61
    })
    gravarBD()
    desenhar()
    visualizar('lista')
}
function editUsuario(id, nome, vlan60, vlan61) {
    var usuario = listaRegistros.usuarios.find(usuario => usuario.id == id)
    usuario.nome = nome;
    usuario.vlan60 = vlan60;
    usuario.vlan61 = vlan61;
    gravarBD()
    desenhar()
    visualizar('lista')
    
    
    
}
function deleteUsuario(id) {
    listaRegistros.usuarios = listaRegistros.usuarios.filter(usuario => {
        return usuario.id != id
    })
    gravarBD()
    desenhar()

}

function perguntarDeleta(id) {
    if (confirm('Quer deletar o registro de id ' + id)) {
        deleteUsuario(id)
    }
}

function limparEdicao() {
    document.getElementById('nome').value = ''
    document.getElementById('vlan60').value = ''
    document.getElementById('vlan61').value = ''
}


function visualizar(pagina, novo = false, id = null) {
    document.body.setAttribute('page', pagina)
    if (pagina === 'cadastro') {
        if (novo) limparEdicao()
        if (id) {
            const usuario = listaRegistros.usuarios.find(usuario => usuario.id == id)
            if (usuario)
                document.getElementById('id').value = usuario.id
            document.getElementById('nome').value = usuario.nome
            document.getElementById('vlan60').value = usuario.vlan60
            document.getElementById('vlan61').value = usuario.vlan61
        }
        document.getElementById('nome').focus()
    }
}

function submeter(e) {
    e.preventDefault()
    const data = {
        id: document.getElementById('id').value,
        nome: document.getElementById('nome').value,
        vlan60: document.getElementById('vlan60').value,
        vlan61: document.getElementById('vlan61').value,

    }
    if (data.id) {
        editUsuario(data.id, data.nome, data.vlan60, data.vlan61)
    } else {
        insertUsuario(data.nome, data.vlan60, data.vlan61)
    }
}


window.addEventListener('load', () => {
    lerBD()
    document.getElementById('cadastroRegistros').addEventListener('submit', submeter)
    document.getElementById('inputPesquisa').addEventListener('keyup', e => {
        pesquisar(e.target.value)
    })
})