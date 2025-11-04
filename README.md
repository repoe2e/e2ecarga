# E2E Cargas - Sistema de Cotação de Fretes

Sistema web para cálculo de fretes de caminhões desenvolvido com HTML, CSS e JavaScript puro (sem backend).

## 📋 Funcionalidades

- **Formulário completo** com validação em tempo real
- **Cálculo automático** do frete baseado em:
  - Peso da carga (R$ 2,00 por kg)
  - Volume da carga (R$ 10,00 por m³)
  - Distância do trajeto (R$ 1,50 por km)
- **Validações** de todos os campos do formulário
- **Exibição detalhada** da cotação com breakdown do cálculo
- **Botão de solicitação de contato** com modal informativo
- **Interface moderna e responsiva**

## 🚀 Como Usar

1. Abra o arquivo `index.html` em qualquer navegador moderno
2. Preencha o formulário com os dados:
   - Nome completo
   - E-mail
   - WhatsApp (formatação automática)
   - Tamanho da carga em m³
   - Peso da carga em kg
   - Distância do trajeto em km
3. Clique em "Calcular Frete"
4. Visualize a cotação com detalhamento do cálculo
5. Use "Solicitar Contato" para registrar sua solicitação
6. Use "Nova Cotação" para fazer outra cotação

## 📐 Fórmula de Cálculo

```
Valor do Frete = (Peso × R$ 2,00) + (Volume × R$ 10,00) + (Distância × R$ 1,50)
```

**Exemplo:**
- Peso: 500 kg → R$ 1.000,00
- Volume: 10 m³ → R$ 100,00
- Distância: 300 km → R$ 450,00
- **Total: R$ 1.550,00**

## ✅ Validações Implementadas

- **Nome**: Mínimo 3 caracteres
- **E-mail**: Formato válido obrigatório
- **WhatsApp**: Número válido com DDD (10 a 15 dígitos)
- **Tamanho da Carga**: Valor positivo até 1.000 m³
- **Peso da Carga**: Valor positivo até 50.000 kg
- **Distância**: Valor positivo até 10.000 km

## 💾 Armazenamento

Os dados das cotações solicitadas são salvos no `localStorage` do navegador para referência futura.

## 🎨 Características do Design

- Design moderno com gradientes
- Animações suaves
- Totalmente responsivo (mobile-first)
- Feedback visual em tempo real
- Cores profissionais (azul e verde)

## 📱 Compatibilidade

Compatível com todos os navegadores modernos:
- Chrome/Edge
- Firefox
- Safari
- Opera

## 🔧 Customização

Os valores de custo podem ser alterados no arquivo `script.js`:

```javascript
const CUSTO_POR_KG = 2.00;
const CUSTO_POR_M3 = 10.00;
const CUSTO_POR_KM = 1.50;
```

---

Desenvolvido para E2E Cargas - Soluções em transporte e logística
