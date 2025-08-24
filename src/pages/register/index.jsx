// src/pages/MemberRegister.jsx (예시)
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import RegisterWrapper from "../../components/layouts/RegisterWrapper"; // ← 여기!

import IdInput from "../../components/register/IdInput";
import PasswordInput from "../../components/register/PasswordInput";
import EmailInput from "../../components/register/EmailInput";
import PhoneNumberInput from "../../components/register/PhoneNumberInput";
import RegisterButton from "../../components/register/RegisterButton";
import NameInput from "../../components/register/NameInput";

export default function MemberRegister() {
  const [memberId, setMemberId] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [memberName, setMemberName] = useState("");

  const [isIdValid, setIsIdValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isMemberNameValid, setIsMemberNameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const navigate = useNavigate();
  const isValid = isIdValid && isPasswordValid && isMemberNameValid && isEmailValid && isPhoneValid;

  const memberData = {
    memberId,
    memberPw: password,
    memberName,
    memberPhone: phoneNumber,
    memberEmail: email,
  };

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    if (!isValid) return;   // ← 가드
    alert("회원가입이 완료되었습니다!");
    navigate("/");
  };
  
  return (
    <RegisterWrapper align="center" maxWidth={520}>
      <h2 className="form-title">회원가입</h2>
      <form onSubmit={handleSubmit}>
        <IdInput value={memberId} onChange={setMemberId} onValidChange={setIsIdValid} />
        <PasswordInput value={password} onChange={setPassword} onValidChange={setIsPasswordValid} />
        <NameInput value={memberName} onChange={setMemberName} onValidChange={setIsMemberNameValid} />
        <EmailInput value={email} onChange={setEmail} onValidChange={setIsEmailValid} />
        <PhoneNumberInput value={phoneNumber} onChange={setPhoneNumber} onValidChange={setIsPhoneValid} />
        <RegisterButton isValid={isValid} memberData={memberData} />
      </form>
    </RegisterWrapper>
  );
}
