// src/components/PrivacyPolicyModal.tsx
import React from 'react';

type PrivacyPolicyModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const PrivacyPolicyModal = ({ isOpen, onClose }: PrivacyPolicyModalProps) => {
  if (!isOpen) return null; // 모달이 닫혀있으면 렌더링하지 않음

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-2xl h-3/4 flex flex-col shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">개인정보 수집 및 이용 동의</h3>
          <button
            onClick={onClose}
            className="bg-gray-200 p-2 rounded-full text-gray-700 hover:bg-gray-300 transition"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="flex-grow overflow-y-auto text-sm text-gray-700 leading-relaxed custom-scrollbar">
          {/* 여기에 실제 개인정보처리방침 내용을 작성합니다. */}
          <p className="mb-4">
            북멍이 서비스는 회원가입 시 다음과 같은 개인정보를 수집 및 이용합니다.
          </p>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>수집 항목: 아이디, 비밀번호, 닉네임</li>
            <li>수집 목적: 회원 식별, 서비스 이용, 불량 회원 방지 및 비인가 사용 방지</li>
            <li>보유 및 이용 기간: 회원 탈퇴 시까지 또는 관계 법령에 따른 보유 기간</li>
          </ul>
          <p className="mb-4">
            이용자는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다.
            단, 동의 거부 시 회원가입 및 서비스 이용이 제한될 수 있습니다.
          </p>
          <p className="mb-4">
            자세한 내용은 개인정보처리방침 전문을 참고해주시기 바랍니다.
          </p>
          {/* 더미 내용 추가 (실제 내용은 훨씬 길 수 있습니다.) */}
          <p className="mb-4">
            제1조 (목적)
            본 약관은 [회사명] (이하 "회사"라 함)이 제공하는 북멍이 서비스(이하 "서비스"라 함)의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임 사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
          </p>
          <p className="mb-4">
            제2조 (용어의 정의)
            본 약관에서 사용하는 용어의 정의는 다음과 같습니다.<br/>
            1. "서비스": 회원이 모바일 기기 또는 웹을 통하여 이용할 수 있는 북멍이 도서 검색 및 즐겨찾기 서비스.<br/>
            2. "회원": 본 약관에 동의하고 서비스 이용 자격을 부여받은 자.<br/>
            3. "아이디": 회원의 식별과 서비스 이용을 위하여 회원이 설정하고 회사가 승인하는 문자, 숫자 또는 특수문자의 조합.<br/>
            4. "비밀번호": 회원이 부여받은 아이디와 일치하는 회원임을 확인하고 회원의 비밀 보호를 위해 회원 자신이 정한 문자, 숫자 또는 특수문자의 조합.
          </p>
          <p className="mb-4">
            제3조 (약관의 효력 및 변경)
            1. 본 약관은 서비스 웹사이트([웹사이트 주소])에 게시하고 회원이 이에 동의함으로써 효력이 발생합니다.<br/>
            2. 회사는 약관의 규제에 관한 법률, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.<br/>
            3. 회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행 약관과 함께 서비스 웹사이트에 그 적용일자 7일 전부터 적용일자 전일까지 공지합니다. 다만, 회원에게 불리하게 약관 내용을 변경하는 경우에는 최소한 30일 이상의 사전 유예기간을 두고 공지합니다.<br/>
            4. 회원이 개정된 약관의 적용에 동의하지 않는 경우, 회원은 서비스 이용을 중단하고 탈퇴할 수 있습니다.
          </p>
          <p className="mb-4">
            제4조 (회원가입)
            1. 회원가입은 서비스를 이용하려는 자가 본 약관의 내용에 대하여 동의를 한 다음 회사가 정한 절차에 따라 가입 신청을 하고, 회사가 이러한 신청에 대하여 승낙함으로써 체결됩니다.<br/>
            2. 회사는 다음 각 호에 해당하는 신청에 대하여는 승낙하지 아니할 수 있습니다.<br/>
               가. 가입신청자가 본 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우<br/>
               나. 실명이 아니거나 타인의 명의를 이용한 경우<br/>
               다. 허위 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우<br/>
               라. 기타 본 약관에 위배되거나 위법 또는 부당한 이용신청임이 확인된 경우<br/>
            3. 회사는 서비스 관련 설비의 여유가 없거나, 기술상 또는 업무상 문제가 있는 경우에는 승낙을 유보할 수 있습니다.
          </p>
          <p>
            본 개인정보 수집 및 이용 동의는 서비스 제공을 위해 필수적입니다.
          </p>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;