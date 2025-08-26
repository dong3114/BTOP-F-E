import React, { useState } from 'react'

function AdminUserInfo() {
    const [id, setId] = useState('아이디');
    const [name, setName] = useState('이름');
    const [password, setPassword] = useState('1234');
    const [nickName, setnickName] = useState('닉네임');
    const [phone, setPhone] = useState('010-1234-5678');
    const [gender, setGender] = useState('남');
    const [birth, setBirth] = useState('2000/01/01');
    const [region, setRegion] = useState('광주광역시');
    const [roleLevel, setRoleLevel] = useState(1);
  return (
        <div>

      <div className='title'>
        <p>회원 관리</p>
      </div>
      <div>
        <div className='userInfo'>
            <table>
                <colgroup>
                    <col width={"25%"}></col>
                    <col width={"75%"}></col>
                </colgroup>
                <tr>
                    <th>아이디</th>
                    <td><span>{id}</span></td>
                </tr>
                <tr>
                    <th>이름</th>
                    <td><input type='text'
                        name="name"
                        placeholder="name"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                        }} /></td>
                </tr>
                <tr>
                    <th>비밀번호</th>
                    <td><input type='password'
                        name="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }} /></td>
                </tr>
                <tr>
                    <th>닉네임</th>
                    <td><input type='text'
                        name="nickName"
                        placeholder="nickName"
                        value={nickName}
                        onChange={(e) => {
                            setnickName(e.target.value);
                        }} /></td>
                </tr>
                <tr>
                    <th>연락처</th>
                    <td><input type='text'
                        name="phone"
                        placeholder="phone"
                        value={phone}
                        onChange={(e) => {
                            setPhone(e.target.value);
                        }} /></td>
                </tr>
                <tr>
                    <th>성별</th>
                    <td><input type='text'
                        name="phone"
                        placeholder="phone"
                        value={gender}
                        onChange={(e) => {
                            setGender(e.target.value);
                        }} /></td>
                </tr>
                <tr>
                    <th>생년월일</th>
                    <td><input type='text'
                        name="phone"
                        placeholder="phone"
                        value={birth}
                        onChange={(e) => {
                            setBirth(e.target.value);
                        }} /></td>
                </tr>
                <tr>
                    <th>주소</th>
                    <td><input type='text'
                        name="phone"
                        placeholder="phone"
                        value={region}
                        onChange={(e) => {
                            setRegion(e.target.value);
                        }} /></td>
                </tr>
                <tr>
                    <th>권한레벨</th>
                    <td><input type='text'
                        name="phone"
                        placeholder="phone"
                        value={roleLevel}
                        onChange={(e) => {
                            setRoleLevel(e.target.value);
                        }} /></td>
                </tr>
            </table>

        </div>
            <div className='btnBoardList'>
                <button id='boardList'>목록</button>
        </div>
      </div>
    </div>
  )
}

export default AdminUserInfo