/* ########################################### */
/* Configuração do preview */
/* ########################################### */

/* Caminho das imagens */
var patch = "exports/";

/* Nome das imagens */
var arrImages = [	
	"3_1_4_Troque_seus_pontos_02.jpeg",
	"3_1_Membership_Rewards.jpeg",
	"5_Viagens_02.jpeg"
];

/* Nome do zip para download */
var zipDownload = "PACOTE1_20121031.zip";

/* Informações sobre o projeto */
var infProjeto = {
	nome: 	"Bradesco",
	desc: 	"Direção de Arte do Portal Amex",
	pacote: "Pacote 01 com ajustes da devolutiva",
	resp: 	"Cristiano Fernandes", 
	data: 	"31/10/2012"
};

/* Carrega Preview */
Preview = new LayoutPreview({
	data: arrImages,
	patch: patch,
	zip: zipDownload,
	info: infProjeto
});