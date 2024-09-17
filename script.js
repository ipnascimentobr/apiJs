const apiUrl = 'https://jsonplaceholder.typicode.com/posts';
const postsPerPage = 5;
let currentPage = 1;
let totalPosts = 0;

async function fetchPosts(page) {
    try {
        const response = await fetch(`${apiUrl}?_page=${page}&_limit=${postsPerPage}`);
        const posts = await response.json();
        const totalPostsHeader = response.headers.get('x-total-count');
        totalPosts = totalPostsHeader ? parseInt(totalPostsHeader, 10) : 0;
        return posts;
    } catch (error) {
        console.error('Erro ao carregar posts:', error);
    }
}

function renderPosts(posts) {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';
    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.body}</p>
            <button onclick="loadComments(${post.id})">Ver Comentários</button>
            <div id="comments-${post.id}" class="comments"></div>
        `;
        postsContainer.appendChild(postDiv);
    });
}

function renderPagination() {
    const paginationContainer = document.getElementById('pagination');
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    paginationContainer.innerHTML = '';

    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Página Anterior';
        prevButton.onclick = () => changePage(currentPage - 1);
        paginationContainer.appendChild(prevButton);
    }

    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Próxima Página';
        nextButton.onclick = () => changePage(currentPage + 1);
        paginationContainer.appendChild(nextButton);
    }
}

async function loadPosts() {
    const posts = await fetchPosts(currentPage);
    if (posts) {
        renderPosts(posts);
        renderPagination();
    }
}

async function loadComments(postId) {
    const commentsDiv = document.getElementById(`comments-${postId}`);
    if (commentsDiv.innerHTML.trim() !== '') {
        return; // Evita recarregar os comentários se já estiverem carregados
    }

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
        const comments = await response.json();
        commentsDiv.innerHTML = ''; // Limpar comentários antigos
        comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment';
            commentDiv.innerHTML = `
                <h3>${comment.name}</h3>
                <p>${comment.body}</p>
                <p><strong>${comment.email}</strong></p>
            `;
            commentsDiv.appendChild(commentDiv);
        });
    } catch (error) {
        console.error('Erro ao carregar comentários:', error);
    }
}

function changePage(page) {
    currentPage = page;
    loadPosts();
}

document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
});
