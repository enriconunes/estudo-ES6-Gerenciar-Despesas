
class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    // validar dados do furmulario
    validarDados() {
        for (let i in this) {
            // this = referencia ao proprio objeto
            // i = atributo
            // this[i] = valor do atributo (simitar a this.ano)
            console.log(this[i])
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }
        return true
    }
}

class Bd {

    constructor() {
        // se ainda nao houver nenhum elemento com a key 'id' no local storage, entao adiciona este elemento e atribui 0 como valor.
        if (localStorage.getItem('id') === null) {
            //(key, valor)
            localStorage.setItem('id', 0)
        }
    }

    // Metodo gravar que recebe uma despesa
    gravar(objeto) {

        // 1. recupera o valor da chave 'id'
        // 2. incrementa este valor e guarda em 'novoId'
        // 3. adiciona o objeto no local storage com a key 'novoId'
        // 4. sobrescreve o valor da key 'id' no local storage com o valor do id atualizado
        let id = localStorage.getItem('id')
        let novoId = parseInt(id) + 1

        // Parametros: identificador do item, o proprio item
        // JSON.stringfy converte para JSON
        localStorage.setItem(novoId, JSON.stringify(objeto))

        localStorage.setItem("id", novoId)
    }

    recuperarRegistros() {

        //array despesas
        let despesas = Array()

        let qtdItens = localStorage.getItem('id')
        for (let i = 1; i <= qtdItens; i++) {
            //converter json para obj literal
            let despesa = JSON.parse(localStorage.getItem(i))
            //identificar indices que foram excluidos
            //se nao encontrar um id, retorna null
            if (despesa !== null) {
                //adiciona um novo atributo 'id' para identificar na exclusao
                despesa.id = i
                despesas.push(despesa)
            }
        }

        return despesas
    }

    // fazer a pesquisa/filtro das despesas
    // parametro = objeto literal com atributos da busca atual
    pesquisar(despesa) {

        let despesasFiltradas = Array()
        // reaproveitar o codigo ja feito
        despesasFiltradas = this.recuperarRegistros()

        //ano
        if (despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }

        //mes
        if (despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }

        //dia
        if (despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }

        //tipo
        if (despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }

        //descricao
        if (despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }

        return despesasFiltradas
    }

    remover(id) {
        localStorage.removeItem(id)
    }
}

// ao instanciar este elemento, verifica-se a existencia de um elemento com a key 'id' no local storage
let bd = new Bd()

function cadastrarDespesa() {

    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    // criar novo objeto com os valores recebidos
    let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

    // verificar dados do formulario
    if (despesa.validarDados()) {
        // DADOS VALIDOS

        // chama o metodo 'gravar' do objeto bd para adicionar este objeto no local storage
        bd.gravar(despesa)

        // modificar o modal
        document.getElementById('modal-titulo').innerHTML = "Feito!"
        document.getElementById('modal-titulo').className = 'modal-header text-success'
        document.getElementById('modal-conteudo').innerHTML = 'Despesa cadastrada com sucesso!'
        document.getElementById('modal-botao').className = 'btn btn-success'
        document.getElementById('modal-botao').innerHTML = 'Continuar'

        // comando JQuery / mostrar modal
        $('#modalGravacao').modal('show')

        // limpar os campos de input
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''

    } else {
        // dados invalidos

        document.getElementById('modal-titulo').innerHTML = "Erro na gravação!"
        document.getElementById('modal-titulo').className = 'modal-header text-danger'
        document.getElementById('modal-conteudo').innerHTML = 'Preencha todos os campos para validar a despesa.'
        document.getElementById('modal-botao').className = 'btn btn-danger'


        $('#modalGravacao').modal('show')
    }

}

// MOSTRAR LISTA DE DESPESAS
// é chamada quando a página 'consulta' é carregada
// evento: onload()
function carregarLista() {
    // receber o array com todas as despesas
    let despesas = bd.recuperarRegistros()

    // selecionando tbody da tabela
    let listaDespesas = document.getElementById('lista-despesas')

    // inserir o array na tabela
    let qtdItens = localStorage.getItem('id')
    for (let i = 0; i < qtdItens; i++) {

        // criar linha (tr)
        let linha = listaDespesas.insertRow()

        //criar colunas na linha criada (td)
        linha.insertCell(0).innerHTML = `${despesas[i].dia}/${despesas[i].mes}/${despesas[i].ano}`

        switch (despesas[i].tipo) {
            case '1': despesas[i].tipo = 'Alimentação'
                break
            case '2': despesas[i].tipo = 'Educação'
                break
            case '3': despesas[i].tipo = 'Lazer'
                break
            case '4': despesas[i].tipo = 'Saúde'
                break
            case '5': despesas[i].tipo = 'Transporte'
                break
        }

        linha.insertCell(1).innerHTML = despesas[i].tipo
        linha.insertCell(2).innerHTML = despesas[i].descricao
        linha.insertCell(3).innerHTML = despesas[i].valor


        //criar botao de exclusao
        let btn = document.createElement("button")
        linha.insertCell(4).append(btn)
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        // adicionar um id ao botao referente ao objeto que ele corresponde
        btn.id = `id_despesa_${despesas[i].id}`
        btn.onclick = function () {
            // remove o texto 'id_despesa_' para ficar somente com o numero od id
            let id = this.id.replace('id_despesa_', '')
            bd.remover(id)

            // atualizar página para remover também o elemento em html
            window.location.reload()
        }
    }

 
}

function pesquisarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)

    // selecionando tbody da tabela e limpando
    let listaDespesas = document.getElementById('lista-despesas')
    listaDespesas.innerHTML = ''

    // inserir o array na tabela
    let qtdItens = localStorage.getItem('id')
    for (let i = 0; i < qtdItens; i++) {

        // criar linha (tr)
        let linha = listaDespesas.insertRow()

        //criar colunas na linha criada (td)
        linha.insertCell(0).innerHTML = `${despesas[i].dia}/${despesas[i].mes}/${despesas[i].ano}`

        switch (despesas[i].tipo) {
            case '1': despesas[i].tipo = 'Alimentação'
                break
            case '2': despesas[i].tipo = 'Educação'
                break
            case '3': despesas[i].tipo = 'Lazer'
                break
            case '4': despesas[i].tipo = 'Saúde'
                break
            case '5': despesas[i].tipo = 'Transporte'
                break
        }

        linha.insertCell(1).innerHTML = despesas[i].tipo
        linha.insertCell(2).innerHTML = despesas[i].descricao
        linha.insertCell(3).innerHTML = despesas[i].valor

    }
}


/*

RESUMO DO CÓDIGO

O programa possui duas classes, sendo elas Bd e Despesa.

A classe Bd é responsável por fazer a comunicação com a base de dados (Local Storage), recuperando e inserindo dados.

A classe Despesa é responsavel por criar objetos com todos os atributos de uma despesa (passados pelo formulario). Assim, o armazenamento e gerenciamento destes dados se tornam muito mais fáceis.

Além das classes, há 3 funções primordiais, sendo elas cadastrarDespesa(), carregarLista() e pesquisarDespesa()

1. cadastrarDespesa(): Responsável por recuperar e conferir os dados do formulário, instanciar um objeto do tipo Despesa atribuindo-o os valores do formulário e gravar este objeto (com método da classe Bd) convertendo-o para Json.

2. carregarLista(): Cria um objeto do tipo Bd para usar o método que recupera todos os objetos da base de dados e percorre por todos os dadados adicionando-os à uma nova linha e coluna na tabela. *Fazer a listagem dos objetos.

3. pesquisarDespesa(): Utiliza também um método da classe Bd (metodo pesquisar()) que recupera todos os objetos da base de dados e faz uma filtro no array com estes objetos utilizando array.filter(). Em seguida, o return do método (objetos filtrados) são exibidos.
*/

// relembrando o uso do ARRAY FILTER (array de objetos)

// retornar o array inteiro
// nomeArray.filter(function(f) { return true })

// filtrar por id (atributo 'id' do objeto f)
// nomeArray.filter(function(f) { return f.id <= 10 })

// filtrar com mais de uma condicao
// nomeArray.filter(function(f) { return f.id <= 10 }).filter(function(f) { return f.idade === 10 })

// reduzir o código acima
// nomeArray.filter(f => f.id <= 10).filter(f => f.idade === 10)