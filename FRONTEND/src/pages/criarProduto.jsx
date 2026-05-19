import { useState } from 'react';
import api from '../services/server';
import '../styles/criarProduto.css';

export default function CriarProduto() {
  const [formData, setFormData] = useState({
    nome: '',
    categoria: 'COZINHA',
    estoque: '',
    descricao: '',
    preco: '',
    idAdministrador: 1
  });

  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  const categorias = [
    'COZINHA',
    'SALA',
    'QUARTO',
    'MESAS',
    'GUARDA_ROUPAS',
    'PECAS',
    'RUSTICO'
  ];

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'estoque' || name === 'preco' || name === 'idAdministrador' 
        ? Number(value) 
        : value
    }));
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImagem(file);
      
      // Preview da imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Validação básica
    if (!formData.nome || !formData.estoque || !formData.preco) {
      setMensagem({ 
        tipo: 'erro', 
        texto: 'Preencha todos os campos obrigatórios' 
      });
      return;
    }

    if (!imagem) {
      setMensagem({ 
        tipo: 'erro', 
        texto: 'Selecione uma imagem para o produto' 
      });
      return;
    }

    try {
      setLoading(true);
      setMensagem({ tipo: '', texto: '' });

      // Criar FormData com arquivo
      const data = new FormData();
      data.append('nome', formData.nome);
      data.append('categoria', formData.categoria);
      data.append('estoque', formData.estoque);
      data.append('descricao', formData.descricao);
      data.append('preco', formData.preco);
      data.append('idAdministrador', formData.idAdministrador);
      data.append('foto', imagem);

      const response = await api.post('/produtos', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMensagem({ 
        tipo: 'sucesso', 
        texto: `Produto "${response.data.nome}" criado com sucesso! ID: ${response.data.id}` 
      });

      // Limpar formulário
      setFormData({
        nome: '',
        categoria: 'COZINHA',
        estoque: 0,
        descricao: '',
        preco: 0,
        idAdministrador: 1
      });
      setImagem(null);
      setPreview(null);

    } catch (error) {
      console.error('Erro ao criar produto:', error);
      setMensagem({ 
        tipo: 'erro', 
        texto: error.response?.data?.error || 'Erro ao criar produto. Tente novamente.' 
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="criar-produto-container">
      <div className="criar-produto-form">
        <h1>Criar Novo Produto</h1>
        
        {mensagem.texto && (
          <div className={`mensagem ${mensagem.tipo}`}>
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome do Produto *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              placeholder="Ex: Cadeira Rústica"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="categoria">Categoria *</label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
              >
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="estoque">Estoque *</label>
              <input
                type="number"
                id="estoque"
                name="estoque"
                value={formData.estoque}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="preco">Preço (R$) *</label>
              <input
                type="number"
                id="preco"
                name="preco"
                value={formData.preco}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              placeholder="Descrição do produto (até 500 caracteres)"
              maxLength="500"
              rows="4"
            />
            <small>{formData.descricao.length}/500</small>
          </div>

          <div className="form-group">
            <label htmlFor="foto">Imagem do Produto * (JPEG, PNG, GIF, WebP - até 5MB)</label>
            <div className="file-upload">
              <input
                type="file"
                id="foto"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImageChange}
                required
              />
              <label htmlFor="foto" className="file-label">
                Clique para selecionar imagem
              </label>
            </div>
            
            {preview && (
              <div className="preview">
                <p>Preview:</p>
                <img src={preview} alt="Preview do produto" />
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="btn-submit" 
            disabled={loading}
          >
            {loading ? 'Criando produto...' : 'Criar Produto'}
          </button>
        </form>
      </div>
    </div>
  );
}

