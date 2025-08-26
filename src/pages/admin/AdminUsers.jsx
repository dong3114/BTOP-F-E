import React from 'react'

function AdminUsers() {
  return (
    <div>
      <div className='title'>
        <p>회원 관리</p>
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
          <col width={"20%"}></col>
          <col width={"20%"}></col>
          <col width={"30%"}></col>
          <col width={"15%"}></col>
          </colgroup>
					<thead>
						<tr>
									<th><input type='checkbox'></input></th>
									<th>번호</th>
									<th>아이디</th>
									<th>이름</th>
									<th>연락처</th>
									<th>관리</th>
								</tr>
                </thead>
                <tbody>
                <tr>
                  <td><input type='checkbox'></input></td>
                  <td>2</td>
                  <td>admin</td>
                  <td>admin</td>
                  <td>010-1111-1111</td>
                  <td>6</td>
                </tr>
                </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminUsers