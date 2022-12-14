let objetoAlunos = {};


const criarOption = (dados, tipo)=>{
    const select = document.getElementById(tipo);

    dados.forEach(dado=>{

        const option = document.createElement("option");
        option.value = dado._id;

        if(tipo === 'professor-turma'){
            option.innerText = `${dado.pessoa.nome} ${dado.pessoa.sobrenome}`;
        }

        if(tipo === "materias-turma"){
            option.innerText = `${dado.nome} - ${dado.codigo}`;
        }

        if(tipo === "aluno-turma"){
            option.innerText = `${dado.pessoa.nome}`;
        }

        if(tipo === "pessoa"){
            option.innerText = `${dado.nome} ${dado.sobrenome}`;
        }

        select.append(option);
    });
};

const listar = async(rota, tipo) =>{
    try{
        const lista = await requisicao("GET", rota, null);

        if(lista.status === 200){

            if(lista.content.length > 0){

                return criarOption(lista.content, tipo);
            }
            
            return;
        }

        throw({erro:true, message:lista.content})
    }catch(erro){
        if(erro.erro){
            alert(erro.message);

            return;
        }
    }
};

const listarTurmasTabela = (turma) =>{
    
    const tr = $("[e-id=modelo] tr").clone();
    const tbody = $("[e-id=oficial]");

    $(tr).find("[e-id=codigo]").text(turma.codigo);
    $(tr).find("[e-id=materia]").text(turma.materia.nome);
    $(tr).find("[e-id=professor]").text(turma.professor.pessoa.nome);
    $(tr).find("[e-id=sala]").text(turma.sala);
    $(tr).find("[e-id=horario]").text(turma.horario);
    $(tr).find("[e-id=ver-mais]").on('click', function(){
        verMais(turma._id);
    });

    tr.css("display", "table-row");
    tbody.append(tr);
};

const listarTurmasBanco = async() =>{
    try{

       const turmas = await requisicao("GET", "/v1/turma", null);

       if(turmas.status === 200){

            if(turmas.content.length > 0){
                turmas.content.forEach(turma=>{

                    listarTurmasTabela(turma);
                })
            }
       }else{
        throw({erro:true, message:turmas.content})
       }

    }catch(erro){
        console.log(erro)
        if(erro.erro){

            alert(erro.message);
        }
    }
};


// editar
document.getElementById("btn-editar-turma").onclick = ()=>{
    $("[e-id=codigo-turma]").prop("disabled", false);
    $("[e-id=materia-turma]").prop("disabled", false);
    $("[e-id=professor-turma]").prop("disabled", false);
    $("[e-id=sala-turma]").prop("disabled", false);
    $("[e-id=horario-turma]").prop("disabled", false);
    document.getElementById("btn-editar-turma").style.display = 'none';
    document.getElementById("btn-salvar-turma").style.display = 'block';
};

const listarAlunos = (alunos) =>{
    
    alunos.forEach(aluno=>{
        adicionarAluno(aluno._id,aluno.pessoa.nome)
    })
}

const preencherInputs = (dadosTurma)=>{
    $("[e-id=codigo-turma]").val(dadosTurma.codigo);
    document.getElementById("materias-turma").value = dadosTurma.materia;
    document.getElementById("professor-turma").value = dadosTurma.professor;
    $("[e-id=sala-turma]").val(dadosTurma.sala);
    $("[e-id=horario-turma]").val(dadosTurma.horario);

    if(dadosTurma.aluno.length > 0){
        listarAlunos(dadosTurma.aluno)
    }
};

const verMais = async (id) =>{
    try{
        const buscarTurma = await requisicao("GET", `/v1/turma/${id}`, null);

        if(buscarTurma.status === 200){
            $('#myModal').modal('show');
            $('[e-id=dados-turma]').attr("id", id);
            return preencherInputs(buscarTurma.content);
        }

        throw({erro:true, message:buscarTurma.content});
    }catch(erro){
        console.log(erro)
        if(erro.erro){
            alert(erro.message);
        }
    }
};

document.getElementById("btn-salvar-turma").onclick = async () =>{
    try{
           
        const id =  $('[e-id=dados-turma]').attr("id");
        const atualizarAlunoDados = await  requisicao("PUT", "/v1/turma", {
            id,
            codigo:$("[e-id=codigo-turma]").val(),
            materia:$("[e-id=materias-turma]").val(),
            professor:$("[e-id=professor-turma]").val(),
            sala:$("[e-id=sala-turma]").val(),
            horario:$("[e-id=horario-turma]").val(),

        });

        if(atualizarAlunoDados.status === 200){
            alert(atualizarAlunoDados.content);

            return voltarEstadoModal();
        }

        throw({erro:true, message:atualizarAlunoDados.content});
    }catch(erro){

        if(erro.erro){
            alert(erro.message)
        }

    }
};

document.getElementById("fechar-modal").onclick = ()=>{

    return voltarEstadoModal();
};

const voltarEstadoModal = () => {
    $("[e-id=codigo-turma]").val();
    document.getElementById("materias-turma").value = "";
    document.getElementById("professor-turma").value = ""
    $("[e-id=sala-turma]").val("");
    $("[e-id=horario-turma]").val("");
    $("[e-id=codigo-turma]").prop("disabled", true);
    $("[e-id=materia-turma]").prop("disabled", true);
    $("[e-id=professor-turma]").prop("disabled", true);
    $("[e-id=sala-turma]").prop("disabled", true);
    $("[e-id=horario-turma]").prop("disabled", true);
    document.getElementById("btn-editar-turma").style.display = 'block';
    document.getElementById("btn-salvar-turma").style.display = 'none';
    $('#myModal').modal('hide');

};

document.getElementById("btn-editar-turma-alunos").onclick = ()=>{
    $("[e-id=btn-adicionar-aluno]").prop("disabled", false);
    $("[e-id=aluno-turma]").prop("disabled", false);
    document.getElementById("btn-editar-turma-alunos").style.display='none';
    document.getElementById("btn-salvar-turma-alunos").style.display='block';
    
}

//editar


//adionar alunos

const removerAluno = (id, nome) =>{
    document.getElementById(id).style.display = 'none'
    objetoAlunos[nome] = null;
};

const criarDivAluno = (id, nome) =>{
    const div = document.getElementById("dados-alunos");
    const novaDiv = document.createElement("div");
    const idDateNow = `${id}-${Date.now()}`
    novaDiv.classList.add('div-materia');
    novaDiv.classList.add('ml-2');
    novaDiv.classList.add('mr-2');
    novaDiv.classList.add('mt-2');

    novaDiv.id = idDateNow;
    novaDiv.innerText = nome;
    novaDiv.onclick= function(){
        removerAluno(idDateNow, nome);
    };

    div.append(novaDiv);
};

const adicionarAluno = (id, nomeMateria) =>{
   
    if(!!objetoAlunos[nomeMateria]){
       
        return;
    }

    objetoAlunos[nomeMateria] = id;
    criarDivAluno(id, nomeMateria);
};

const buscarAlunos = () =>{
    let arrayAlunos = [];

    Object.keys(objetoAlunos).forEach(key=>{
        arrayAlunos.push(objetoAlunos[key])
    });
    
    return arrayAlunos;
}

document.getElementById("btn-salvar-turma-alunos").onclick = async()=>{
    try{

        const id =  $('[e-id=dados-turma]').attr("id");
        const atualizarListaAlunos = await requisicao("PUT","/v1/turma", {
            id,
            aluno:buscarAlunos()
        })

        if(atualizarListaAlunos.status === 200){
            alert(atualizarListaAlunos.content);

            return;
        }

        throw({erro:true, message:atualizarListaAlunos.content});
    }catch(erro){

        if(erro.erro){
            alert(erro.message)

            return;
        }
    }
}

document.getElementById("btn-adicionar-aluno").onclick = () =>{
    const select = document.getElementById("aluno-turma");
    const option = select.children[select.selectedIndex];
    const texto = option.textContent;
    adicionarAluno(select.value, texto)
}


//adicionar alunos


listar("/v1/materia", "materias-turma");
listar("/v1/professor", "professor-turma");
listar("/v1/aluno", "aluno-turma");

listarTurmasBanco();