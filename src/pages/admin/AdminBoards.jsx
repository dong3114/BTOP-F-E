import React from 'react'

function AdminBoards() {
  return (
    <div>

      <div className='title'>
        <p>게시판 관리</p>
      </div>
      <div>
        <div>

        <div className='search'>
          <input type='text' placeholder="title" name='searchText' id='searchText'></input>
        </div>
        </div>
        <div className='tablebox'>
        <table>
          <colgroup>
          <col width={"5%"}></col>
          <col width={"10%"}></col>
          <col width={"50%"}></col>
          <col width={"10%"}></col>
          <col width={"10%"}></col>
          <col width={"15%"}></col>
          </colgroup>
					<thead>
						<tr>
									<th><input type='checkbox'></input></th>
									<th>번호</th>
									<th>제목</th>
									<th>작성자</th>
									<th>작성날짜</th>
									<th>관리</th>
								</tr>
                </thead>
                <tbody>
                <tr>
                  <td><input type='checkbox'></input></td>
                  <td>2</td>
                  <td>3</td>
                  <td>4</td>
                  <td>5</td>
                  <td>6</td>
                </tr>
                </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminBoards