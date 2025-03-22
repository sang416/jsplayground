function handleCredentialResponse(response) {
  const id_token = response.credential;
  console.log("ID Token: ", id_token);
  // 여기서 백엔드로 ID 토큰을 보내서 인증 처리
}
// 상수 선언으로 재사용성 높임
const DISPLAY_METHODS = {
  APPEND: 'append',
  HTML: 'html'
};

// 상품 관련 유틸리티 함수들
const productUtils = {
  sortByPrice: products => [...products].sort((a, b) => a.price - b.price),
  sortByName: products => [...products].sort((a, b) => b.title.localeCompare(a.title)),
  filterByPrice: (products, maxPrice = 60000) => products.filter(product => product.price <= maxPrice),
  formatPrice: price => price.toLocaleString() + '원'
};

// 상품 표시 함수 최적화
function showItem(products, method = DISPLAY_METHODS.APPEND) {
  const productHTML = products.map(product => `
      <div class="col-sm-4">
          <img src="https://dummyimage.com/400x400/000/fff" class="w-100" alt="${product.title}">
          <h5>${product.title}</h5>
          <p>가격: ${productUtils.formatPrice(product.price)}</p>
          <button class="btn btn-danger buy">구매</button>
      </div>
  `).join('');

  $('.container1')[method](`<div class="row">${productHTML}</div>`);
}

$(() => {
  let products = [
      { id: 0, price: 70000, title: 'Blossom Dress' },
      { id: 1, price: 50000, title: 'Springfield Shirt' },
      { id: 2, price: 60000, title: 'Black Monastery' }
  ];

  // 초기 상품 표시
  showItem(products, DISPLAY_METHODS.HTML);

  // 이벤트 핸들러 통합
  const handlers = {
      'more-btn': async () => {
          try {
              const data = await $.get('http://localhost:3000/products');
              products = [...products, ...data];
              showItem(data, DISPLAY_METHODS.APPEND);
          } catch (error) {
              console.error('데이터 로드 실패:', error);
          }
      },
      'sort-btn': () => showItem(productUtils.sortByPrice(products), DISPLAY_METHODS.HTML),
      'sort-byName-btn': () => showItem(productUtils.sortByName(products), DISPLAY_METHODS.HTML),
      'filter-btn': () => showItem(productUtils.filterByPrice(products), DISPLAY_METHODS.HTML),
      'list-btn': () => {
          $('.alert').html(products.map(product => 
              `<p>${product.title}</p><p>${productUtils.formatPrice(product.price)}</p>`
          ).join(''));
      },
      'post-btn': () => {
        products.forEach(product => {
          $.ajax({
            url: 'http://localhost:3000/products',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(product),
            success: function (data) {
              console.log('추가됨:', data);
            },
            error: function (xhr, status, error) {
              console.error('에러:', error);
            }
          });
        });
      }
  };

  // 이벤트 리스너 등록
  Object.entries(handlers).forEach(([className, handler]) => {
      $(`.${className}`).click(handler);
  });

  let array0 = [1,2,3];
  array0 = JSON.stringify(array0);
  console.log(array0);
  localStorage.setItem('number',array0);
});