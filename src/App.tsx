import './App.css'
import axios from 'axios';
import { useState } from 'react';

interface PostData {
  nome: string;
  imagem: File | null;
  descricao: string;
}

function App() {
  const [post, setPost] = useState<PostData>({
    nome: '',
    imagem: null,
    descricao: '',
  })
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleinput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (
      e.target instanceof HTMLInputElement &&
      e.target.type === "file" &&
      e.target.files &&
      e.target.files.length > 0
    ) {
      setPost({
        ...post,
        [name]: e.target.files[0],
      });
    } else {
      setPost({
        ...post,
        [name]: value,
      });
    }
  };
  function handlesubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate required fields
    if (!post.nome || !post.imagem || !post.descricao) {
      setError('Todos os campos são obrigatórios');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('nome', post.nome);
    if (post.imagem) {
      formData.append('imagem', post.imagem);
    }
    formData.append('descricao', post.descricao);


    console.log('Sending data:', {
      nome: post.nome,
      imagem: post.imagem ? post.imagem.name : 'null',
      descricao: post.descricao
    });

    axios.post('https://final-try-production.up.railway.app/arte', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        console.log('Success:', response.data);

        setPost({
          nome: '',
          imagem: null,
          descricao: '',
        });

        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      })
      .catch(err => {
        console.error('Error details:', err);

        // More detailed error handling
        if (err.code === 'ECONNABORTED') {
          setError('A requisição demorou muito tempo. Tente novamente.');
        } else if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Response data:', err.response.data);
          console.error('Response status:', err.response.status);
          console.error('Response headers:', err.response.headers);
          setError(`Erro do servidor: ${err.response.status} - ${err.response.data?.message || 'Erro desconhecido'}`);
        } else if (err.request) {
          // The request was made but no response was received
          console.error('No response received:', err.request);
          setError('Servidor não está respondendo. Verifique se o backend está rodando.');
        } else {
          // Something happened in setting up the request that triggered an Error
          setError(`Erro: ${err.message}`);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <header>
        <h1>Adicionar arte</h1>
      </header>
      <form onSubmit={handlesubmit}>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

        <input
          type="text"
          name="nome"
          placeholder="Nome da arte"
          value={post.nome}
          onChange={handleinput}
          disabled={loading}
        />
        <input
          type="file"
          name="imagem"
          accept="image/*"
          onChange={handleinput}
          disabled={loading}
          required
        />
        <textarea

          name="descricao"
          placeholder="Descrição"
          value={post.descricao}
          onChange={handleinput}
          disabled={loading}
          rows={10}
        />
        <button type='submit' disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </>
  )
}

export default App