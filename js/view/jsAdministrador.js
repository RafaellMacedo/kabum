$(document).ready(function(){
    $("#btCancelar").on("click",function(){
        window.location = "login.php";
    });

    $("#btCadastrar").on("click",function(){
        let nome = $("#nome").val();
        let login = $("#login").val();
        let senha = $("#senha").val();
        let confirmar_senha = $("#confirmar_senha").val();
        let erro = false;
        $("#btCadastrar").html("Cadastrando...").prop('disabled', true);
        $("#btCancel").prop('disabled', true);
        limparMensagem();

        removerCSSAdministrador();

        erro = campoVazio("nome", nome);
        erro = campoVazio("login", login);
        erro = campoVazio("senha", senha);
        erro = campoVazio("confirmar_senha", confirmar_senha);

        if(erro == true){
            mensagem("alert-danger","Preencha todos os campos");
            habilitarBotao();

        }else{
            if(senha.length < 6){
                mensagem("alert-danger","Senha não pode ser menor que 6 caracteres!");
                $("#senha").addClass("alert-danger").val("");
                $("#confirmar_senha").addClass("alert-danger").val("");
                habilitarBotao();

            } else if(senha == confirmar_senha){

				$.ajax({
					url: "data/administradorTable.php",
					type: "POST",
					data: {
						action: "insert",
						nome: nome,
						login: login,
						senha: senha,
					}
				}).done(function(data) {
					data = JSON.parse(data);

					if(data.success == true){
                        mensagem("alert-success","Cadastrado com sucesso! Redirecionando para página de login!");

                        $("#btCadastrar").html("Cadastrado");

						setTimeout(function(){
                            window.location = "index.php";
                        }, 3000);
					}else{
                        if(data.mensagem != ""){
                            mensagem("alert-danger",data.mensagem);

                        } else {
                            mensagem("alert-danger","Erro ao cadastrar!");
                        }
                        habilitarBotao();
                    }
				});

            } else {
                mensagem("alert-danger","Senhas diferentes!");
                $("#senha").addClass("alert-danger");
                $("#confirmar_senha").addClass("alert-danger");
                habilitarBotao();
            }
        }
    });

    $("#senha").on("focusout", function(){
        let senha = this.value;
        $("#senha").removeClass("alert-danger alert-success");
        limparMensagem();

        if(senha.length < 6){
            $("#senha").addClass("alert-danger");
        } else {
            $("#senha").addClass("alert-success");

            setTimeout(function(){
                $("#senha").removeClass("alert-danger alert-success");
            }, 2000);
        }
    });

    $("#confirmar_senha").on("keyup", function(){
        let confirmar_senha = this.value;
        let senha = $("#senha").val();
        $("#confirmar_senha").removeClass("alert-danger alert-success");
        limparMensagem();

        console.log('senha', senha);
        console.log('confirmar_senha', confirmar_senha);
        if(senha != confirmar_senha){
            $("#confirmar_senha").addClass("alert-danger");
        } else {
            $("#senha").addClass("alert-success");
            $("#confirmar_senha").addClass("alert-success");

            setTimeout(function(){
                $("#senha").removeClass("alert-danger alert-success");
                $("#confirmar_senha").removeClass("alert-danger alert-success");
            }, 2000);
        }
    });

    $("#login").on("focusout", function(){
        let login = this.value;
        limparMensagem();

        if(login != ""){
            $.ajax({
                url: "data/administradorTable.php",
                type: "POST",
                data: {
                    action: "verificarLogin",
                    login: login
                }
            }).done(function(data) {
                data = JSON.parse(data);

                if(data.success == true){
                    mensagem("alert-danger","Login já em uso no sistema, tente outro login!");

                } else {
                    $("#login").addClass("alert-success");

                    setTimeout(function(){
                        $("#login").removeClass("alert-success");
                    }, 3000);
                }
            });

        }
    });

    function habilitarBotao(){
        $("#btCadastrar").html("Cadastrar").prop('disabled', false);
        $("#btCancel").prop('disabled', false);
    }

    function removerCSSAdministrador(){
        $("#nome").removeClass("campo_vazio");
        $("#login").removeClass("campo_vazio");
        $("#senha").removeClass("campo_vazio");
        $("#confirmar_senha").removeClass("campo_vazio");
    }

    function limparMensagem(){
        $("div.mensagem").removeClass("alert-danger alert-success").html("").hide();
    }
});