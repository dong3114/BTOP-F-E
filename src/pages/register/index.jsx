import { useState } from "react";
import { useNavigate } from "react-router-dom";

import RegisterWrapper from "../../components/layouts/RegisterWrapper"; // ← 여기!

import IdInput from "../../components/register/IdInput";
import PasswordInput from "../../components/register/PasswordInput";
import EmailInput from "../../components/register/EmailInput";
import PhoneNumberInput from "../../components/register/PhoneNumberInput";
import RegisterButton from "../../components/register/RegisterButton";
import NameInput from "../../components/register/NameInput";
import AddressPicker from "../../components/register/AddressPicker";
import GenderInput from "../../components/register/GenderInput";
import BirthInput from "../../components/register/BirthInput";

export default function MemberRegister() {
  const [memberId, setMemberId] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [memberNick, setMemberName] = useState("");
  const [memberRegion, setMemberRegion] = useState("");
  const [memberBirth, setMemberBirth] = useState("");
  const [memberGender, setMemberGender] = useState("");

  const [isIdValid, setIsIdValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isMemberNameValid, setIsMemberNameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [isBirthValid, setIsBirthValid] = useState(false);
  const [isGenderValid, setIsGenderValid] = useState(false);

  const navigate = useNavigate();
  const isValid = isIdValid && isPasswordValid && isMemberNameValid && isEmailValid && isPhoneValid && isAddressValid && isBirthValid && isGenderValid;

  const memberInfo = {
    memberId,
    memberPw: password,
    memberNick,
    memberPhone: phoneNumber,
    memberEmail: email,
    memberGender,
    memberBirth,
    memberRegion,
  };

  return (
    <RegisterWrapper align="center" maxWidth={520}>
      <h2 className="form-title">회원가입</h2>
      <form >
        <IdInput value={memberId} onChange={setMemberId} onValidChange={setIsIdValid} />
        <PasswordInput value={password} onChange={setPassword} onValidChange={setIsPasswordValid} />
        <NameInput value={memberNick} onChange={setMemberName} onValidChange={setIsMemberNameValid} />
        <AddressPicker value={memberRegion} onChange={setMemberRegion} onValidChange={setIsAddressValid} />
        <EmailInput value={email} onChange={setEmail} onValidChange={setIsEmailValid} />
        <BirthInput value={memberBirth} onChange={setMemberBirth} onValidChange={setIsBirthValid} />
        <GenderInput value={memberGender} onChange={setMemberGender} onValidChange={setIsGenderValid} />
        <PhoneNumberInput value={phoneNumber} onChange={setPhoneNumber} onValidChange={setIsPhoneValid} />
        <RegisterButton isValid={isValid} memberInfo={memberInfo} />
      </form>
    </RegisterWrapper>
  );
}
