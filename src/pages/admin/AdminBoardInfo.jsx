import React from 'react'

function AdminBoardInfo() {
  return (
    <div>

      <div className='title'>
        <p>게시판 관리</p>
      </div>
      <div>
        <div className='boardTitle'>
            <div>
                <span>Title</span>
            </div>
            <div>
                <ul>
                    <li><span>작성자</span><p>관리자</p></li>
                    <li><span>작성일</span><p>2025.08.25</p></li>
                </ul>
            </div>

        </div>
        <div className='boardContext'>
                <div className='context'>안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요<br></br>
                안녕하세요</div>
            <div className='btnBoardList'>
                <button id='boardList'>목록</button>
            </div>
        </div>
      </div>
    </div>
  )
}

export default AdminBoardInfo