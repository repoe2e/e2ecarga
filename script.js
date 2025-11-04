// Constantes de custo (valores por unidade)
const CUSTO_POR_KG = 2.00;
const CUSTO_POR_M3 = 10.00;
const CUSTO_POR_KM = 1.50;

// Elementos do DOM
const form = document.getElementById('cotacaoForm');
const resultadoContainer = document.getElementById('resultadoContainer');
const formContainer = document.querySelector('.form-container');
const nomeInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const whatsappInput = document.getElementById('whatsapp');
const tamanhoInput = document.getElementById('tamanhoCarga');
const pesoInput = document.getElementById('pesoCarga');
const distanciaInput = document.getElementById('distancia');
const solicitarContatoBtn = document.getElementById('solicitarContato');
const novaCotacaoBtn = document.getElementById('novaCotacao');
const contatoModal = document.getElementById('contatoModal');
const closeModal = document.getElementById('closeModal');
const fecharModalBtn = document.getElementById('fecharModal');

// Event listeners
form.addEventListener('submit', handleFormSubmit);
nomeInput.addEventListener('blur', () => validateNome());
emailInput.addEventListener('blur', () => validateEmail());
whatsappInput.addEventListener('blur', () => validateWhatsApp());
tamanhoInput.addEventListener('input', () => validateTamanho());
pesoInput.addEventListener('input', () => validatePeso());
distanciaInput.addEventListener('input', () => validateDistancia());

// Validar em tempo real enquanto o usuário digita
tamanhoInput.addEventListener('input', calculateFrete);
pesoInput.addEventListener('input', calculateFrete);
distanciaInput.addEventListener('input', calculateFrete);

solicitarContatoBtn.addEventListener('click', handleSolicitarContato);
novaCotacaoBtn.addEventListener('click', handleNovaCotacao);
closeModal.addEventListener('click', closeModalFunc);
fecharModalBtn.addEventListener('click', closeModalFunc);

// Variável para controlar se deve redirecionar após fechar o modal
let shouldRedirectToForm = false;

// Fechar modal ao clicar fora dele
window.addEventListener('click', (event) => {
    if (event.target === contatoModal) {
        closeModalFunc();
        if (shouldRedirectToForm) {
            handleNovaCotacao();
            shouldRedirectToForm = false;
        }
    }
});

// Validações
function validateNome() {
    const nome = nomeInput.value.trim();
    const errorElement = document.getElementById('nomeError');
    
    if (nome === '') {
        errorElement.textContent = 'O nome é obrigatório';
        nomeInput.style.borderColor = 'var(--danger-color)';
        return false;
    }
    
    // Verificar se contém apenas letras e espaços (sem números ou caracteres especiais)
    const nomeRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
    if (!nomeRegex.test(nome)) {
        errorElement.textContent = 'O nome não pode conter números ou caracteres especiais';
        nomeInput.style.borderColor = 'var(--danger-color)';
        return false;
    }
    
    // Dividir o nome em partes (primeiro nome e sobrenome)
    const partesNome = nome.split(/\s+/).filter(parte => parte.length > 0);
    
    if (partesNome.length < 2) {
        errorElement.textContent = 'Por favor, informe seu nome completo (nome e sobrenome)';
        nomeInput.style.borderColor = 'var(--danger-color)';
        return false;
    }
    
    const primeiroNome = partesNome[0];
    const sobrenome = partesNome[partesNome.length - 1];
    
    // Verificar se o primeiro nome tem pelo menos 3 letras
    if (primeiroNome.length < 3) {
        errorElement.textContent = 'O primeiro nome deve ter pelo menos 3 letras';
        nomeInput.style.borderColor = 'var(--danger-color)';
        return false;
    }
    
    // Verificar se o sobrenome tem pelo menos 2 letras
    if (sobrenome.length < 2) {
        errorElement.textContent = 'O sobrenome deve ter pelo menos 2 letras';
        nomeInput.style.borderColor = 'var(--danger-color)';
        return false;
    }
    
    errorElement.textContent = '';
    nomeInput.style.borderColor = 'var(--border-color)';
    return true;
}

function validateEmail() {
    const email = emailInput.value.trim();
    const errorElement = document.getElementById('emailError');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email === '') {
        errorElement.textContent = 'O e-mail é obrigatório';
        emailInput.style.borderColor = 'var(--danger-color)';
        return false;
    }
    
    if (!emailRegex.test(email)) {
        errorElement.textContent = 'Por favor, insira um e-mail válido';
        emailInput.style.borderColor = 'var(--danger-color)';
        return false;
    }
    
    errorElement.textContent = '';
    emailInput.style.borderColor = 'var(--border-color)';
    return true;
}

function validateWhatsApp() {
    const whatsapp = whatsappInput.value.trim();
    const errorElement = document.getElementById('whatsappError');
    
    if (whatsapp === '') {
        errorElement.textContent = 'O WhatsApp é obrigatório';
        whatsappInput.style.borderColor = 'var(--danger-color)';
        return false;
    }
    
    // Remove caracteres não numéricos para validar (já temos +55 fixo, então validamos apenas o restante)
    const digitsOnly = whatsapp.replace(/\D/g, '');
    // DDD (2 dígitos) + número (8 ou 9 dígitos) = 10 ou 11 dígitos
    if (digitsOnly.length < 10 || digitsOnly.length > 11) {
        errorElement.textContent = 'Por favor, insira um número válido com DDD (ex: 11 98765-4321)';
        whatsappInput.style.borderColor = 'var(--danger-color)';
        return false;
    }
    
    errorElement.textContent = '';
    whatsappInput.style.borderColor = 'var(--border-color)';
    return true;
}

function validateTamanho() {
    const tamanho = parseFloat(tamanhoInput.value);
    const errorElement = document.getElementById('tamanhoError');
    
    if (isNaN(tamanho) || tamanho <= 0) {
        errorElement.textContent = 'Por favor, insira um valor válido maior que zero';
        tamanhoInput.style.borderColor = 'var(--danger-color)';
        return false;
    }
    
    if (tamanho > 1000) {
        errorElement.textContent = 'O valor máximo permitido é 1000 m³';
        tamanhoInput.style.borderColor = 'var(--danger-color)';
        return false;
    }
    
    errorElement.textContent = '';
    tamanhoInput.style.borderColor = 'var(--border-color)';
    return true;
}

function validatePeso() {
    const peso = parseFloat(pesoInput.value);
    const errorElement = document.getElementById('pesoError');
    
    if (isNaN(peso) || peso <= 0) {
        errorElement.textContent = 'Por favor, insira um valor válido maior que zero';
        pesoInput.style.borderColor = 'var(--danger-color)';
        return false;
    }
    
    if (peso > 50000) {
        errorElement.textContent = 'O valor máximo permitido é 50.000 kg';
        pesoInput.style.borderColor = 'var(--danger-color)';
        return false;
    }
    
    errorElement.textContent = '';
    pesoInput.style.borderColor = 'var(--border-color)';
    return true;
}

function validateDistancia() {
    const distancia = parseFloat(distanciaInput.value);
    const errorElement = document.getElementById('distanciaError');
    
    if (isNaN(distancia) || distancia <= 0) {
        errorElement.textContent = 'Por favor, insira um valor válido maior que zero';
        distanciaInput.style.borderColor = 'var(--danger-color)';
        return false;
    }
    
    if (distancia > 10000) {
        errorElement.textContent = 'O valor máximo permitido é 10.000 km';
        distanciaInput.style.borderColor = 'var(--danger-color)';
        return false;
    }
    
    errorElement.textContent = '';
    distanciaInput.style.borderColor = 'var(--border-color)';
    return true;
}

// Calcular frete em tempo real
function calculateFrete() {
    const tamanho = parseFloat(tamanhoInput.value) || 0;
    const peso = parseFloat(pesoInput.value) || 0;
    const distancia = parseFloat(distanciaInput.value) || 0;
    
    if (tamanho <= 0 || peso <= 0 || distancia <= 0) {
        return;
    }
    
    // Calcular componentes
    const custoPeso = peso * CUSTO_POR_KG;
    const custoVolume = tamanho * CUSTO_POR_M3;
    const custoDistancia = distancia * CUSTO_POR_KM;
    
    // Calcular valor total
    const valorTotal = custoPeso + custoVolume + custoDistancia;
    
    // Atualizar a exibição se o resultado já estiver visível
    if (resultadoContainer.style.display !== 'none') {
        updateResultadoDisplay(valorTotal, peso, tamanho, distancia, custoPeso, custoVolume, custoDistancia);
    }
}

// Atualizar exibição do resultado
function updateResultadoDisplay(valorTotal, peso, tamanho, distancia, custoPeso, custoVolume, custoDistancia) {
    document.getElementById('valorFrete').textContent = formatCurrency(valorTotal);
    document.getElementById('pesoDetalhe').textContent = formatNumber(peso) + ' kg';
    document.getElementById('volumeDetalhe').textContent = formatNumber(tamanho) + ' m³';
    document.getElementById('distanciaDetalhe').textContent = formatNumber(distancia) + ' km';
    document.getElementById('custoPeso').textContent = formatCurrency(custoPeso);
    document.getElementById('custoVolume').textContent = formatCurrency(custoVolume);
    document.getElementById('custoDistancia').textContent = formatCurrency(custoDistancia);
}

// Formatar moeda
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Formatar número
function formatNumber(value) {
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: value % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2
    }).format(value);
}

// Handler do submit do formulário
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Validar todos os campos
    const isNomeValid = validateNome();
    const isEmailValid = validateEmail();
    const isWhatsAppValid = validateWhatsApp();
    const isTamanhoValid = validateTamanho();
    const isPesoValid = validatePeso();
    const isDistanciaValid = validateDistancia();
    
    if (!isNomeValid || !isEmailValid || !isWhatsAppValid || 
        !isTamanhoValid || !isPesoValid || !isDistanciaValid) {
        return;
    }
    
    // Obter valores
    const tamanho = parseFloat(tamanhoInput.value);
    const peso = parseFloat(pesoInput.value);
    const distancia = parseFloat(distanciaInput.value);
    
    // Calcular frete
    const custoPeso = peso * CUSTO_POR_KG;
    const custoVolume = tamanho * CUSTO_POR_M3;
    const custoDistancia = distancia * CUSTO_POR_KM;
    const valorTotal = custoPeso + custoVolume + custoDistancia;
    
    // Atualizar display
    updateResultadoDisplay(valorTotal, peso, tamanho, distancia, custoPeso, custoVolume, custoDistancia);
    
    // Mostrar resultado e ocultar formulário
    formContainer.style.display = 'none';
    resultadoContainer.style.display = 'block';
    
    // Scroll suave para o resultado
    setTimeout(() => {
        resultadoContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
}

// Handler do botão solicitar contato
function handleSolicitarContato() {
    // Aqui você poderia enviar os dados para um backend se tivesse
    // Por enquanto, apenas mostramos o modal
    
    // Salvar dados no localStorage para referência (incluindo +55 no WhatsApp)
    const dadosCotacao = {
        nome: nomeInput.value,
        email: emailInput.value,
        whatsapp: '+55 ' + whatsappInput.value,
        tamanho: parseFloat(tamanhoInput.value),
        peso: parseFloat(pesoInput.value),
        distancia: parseFloat(distanciaInput.value),
        valorFrete: document.getElementById('valorFrete').textContent,
        data: new Date().toISOString()
    };
    
    // Salvar no localStorage
    const cotacoes = JSON.parse(localStorage.getItem('cotacoes') || '[]');
    cotacoes.push(dadosCotacao);
    localStorage.setItem('cotacoes', JSON.stringify(cotacoes));
    
    // Marcar que deve redirecionar após fechar o modal
    shouldRedirectToForm = true;
    
    // Mostrar modal e, ao fechar, redirecionar para o formulário
    contatoModal.style.display = 'flex';
}

// Handler do botão nova cotação
function handleNovaCotacao() {
    // Limpar formulário
    form.reset();
    
    // Limpar mensagens de erro
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
    
    // Resetar bordas dos inputs
    document.querySelectorAll('.form-group input').forEach(input => {
        input.style.borderColor = 'var(--border-color)';
    });
    
    // Ocultar resultado e mostrar formulário
    resultadoContainer.style.display = 'none';
    formContainer.style.display = 'block';
    
    // Scroll para o formulário
    setTimeout(() => {
        document.getElementById('cotacaoForm').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
}

// Fechar modal
function closeModalFunc() {
    contatoModal.style.display = 'none';
    // Se deve redirecionar, resetar formulário
    if (shouldRedirectToForm) {
        handleNovaCotacao();
        shouldRedirectToForm = false;
    }
}

// Formatação automática do WhatsApp enquanto digita (sem o +55, pois já está fixo)
whatsappInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
        if (value.length <= 2) {
            // Apenas DDD
            value = value;
        } else if (value.length <= 10) {
            // DDD + 8 dígitos
            value = `${value.slice(0, 2)} ${value.slice(2, 6)}-${value.slice(6, 10)}`;
        } else {
            // DDD + 9 dígitos
            value = `${value.slice(0, 2)} ${value.slice(2, 7)}-${value.slice(7, 11)}`;
        }
    }
    e.target.value = value;
});
