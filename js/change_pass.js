document.getElementById('change-password-btn').addEventListener('click', () => {
    document.getElementById('change-password-modal').style.display = 'block';
  });
  
  document.getElementById('change-password-form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmNewPassword = document.getElementById('confirm-new-password').value;
  
    if (newPassword !== confirmNewPassword) {
      alert('Mật khẩu mới không khớp!');
      return;
    }
  
    const response = await fetch('/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  
    const result = await response.json();
    if (result.error) {
      alert(result.error);
    } else {
      alert('Đổi mật khẩu thành công!');
      document.getElementById('change-password-modal').style.display = 'none';
    }
  });
  document.getElementById('change-password-btn').addEventListener('click', () => {
    document.getElementById('change-password-modal').style.display = 'flex';
  });
  
  document.getElementById('change-password-modal').addEventListener('click', (event) => {
    if (event.target === document.getElementById('change-password-modal')) {
      document.getElementById('change-password-modal').style.display = 'none';
    }
  });
  