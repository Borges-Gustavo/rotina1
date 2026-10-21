import { adicionarLancamento, buscarLancamentos, deletarLancamento } from "./functions.js";

const formulario = document.getElementById('form');

async function lista() {
    const lancamentos = await buscarLancamentos();
    const container = document.getElementById('lista');
    const receitas = lancamentos
        .filter((lancamento) => lancamento.tipo === 'receita')
        .reduce((total, lancamento) => total + Number(lancamento.valor), 0);
    const despesas = lancamentos
        .filter((lancamento) => lancamento.tipo === 'despesa')
        .reduce((total, lancamento) => total + Number(lancamento.valor), 0);

    document.getElementById('receitas').textContent = formatarMoeda(receitas);
    document.getElementById('despesas').textContent = formatarMoeda(despesas);
    document.getElementById('saldo').textContent = formatarMoeda(receitas - despesas);
    container.innerHTML = '';

    lancamentos.sort((a, b) => new Date(b.data) - new Date(a.data));
    lancamentos.forEach((lancamento) => {
        const card = document.createElement('div');
        card.classList.add('card-lancamento', lancamento.tipo);
        card.innerHTML = `
            <div>
                <h3>${lancamento.descricao}</h3>
                <p>${lancamento.categoria} · ${formatarData(lancamento.data)}</p>
            </div>
            <strong>${lancamento.tipo === 'receita' ? '+' : '-'} ${formatarMoeda(lancamento.valor)}</strong>
            <button class="btn-apagar" data-id="${lancamento.id}" aria-label="Excluir lançamento">Excluir</button>
        `;
        
        // Seleciona o botão de apagar que acabou de ser criado e adiciona o evento
        const btnApagar = card.querySelector('.btn-apagar');
        btnApagar.addEventListener('click', async () => {
            const idLancamento = btnApagar.getAttribute('data-id');
            await deletarLancamento(idLancamento);
            await lista();
        });

        container.appendChild(card);
    });
}

// Carrega a lista assim que a página abre
lista(); 

formulario.addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede que a página recarregue sozinha

    const descricao = document.getElementById('descricao').value;
    const categoria = document.getElementById('categoria').value;
    const tipo = document.getElementById('tipo').value;
    const valor = document.getElementById('valor').value;
    const data = document.getElementById('data').value;

    // Guarda no Firebase
    await adicionarLancamento(descricao, categoria, tipo, valor, data);

    formulario.reset(); // Limpa os campos do formulário

    // Atualiza a lista no ecrã para mostrar o novo item
    await lista(); 
});

function formatarMoeda(valor) {
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarData(data) {
    return new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR');
}