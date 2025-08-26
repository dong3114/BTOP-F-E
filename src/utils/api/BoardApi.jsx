import BTOPAPI from "./BasicAPI"

export const Both = {
    BothList: () => {
        return BTOPAPI.get(`/api/board/all`)
            .then((res) => { // 여기서 res = axios 전체 응답 객체
                if (!res.data || res.data.length === 0) {
                    console.log("게시물이 없습니다.", res.data);
                    return [];
                }
                console.log("게시물:", res.data);
                return res.data; // 진짜 데이터는 res.data
            })
            .catch((err) => {
                console.error("통신중 오류 발생", err);
                return [];
            })
    },
    BothInfo: (boardNo) => {
        return BTOPAPI.get(`/api/board/${boardNo}`)
            .then((res) => { // 응답 객체 전체를 'res'로 받음
                if (res.data == null) { // res.data로 실제 데이터에 접근
                    console.log(`${res.data}`);
                    console.log(`${boardNo}이 작성한 글을 찾을 수가 없습니다.`);
                    return;
                }
                console.log("게시물:", res.data);
                return res.data; // 실제 데이터를 반환
            })
            .catch((err) => {
                console.error("통신중 오류 발생", err);
            });
    },
    BothCo: () => {
        return BTOPAPI.get(`/api/board/count`)
            .then((res) => { // 응답 객체 전체를 'res'로 받음
                if (res.data == null) { // res.data로 실제 데이터에 접근
                    console.log(`게시물을 찾을 수가 없습니다.`);
                    return;
                }
                console.log("게시물:", res.data);
                return res.data; // 실제 데이터를 반환
            })
            .catch((err) => {
                console.error("통신중 오류 발생", err)
            })
    },
    BothAdd: () => {
        return BTOPAPI.get(`/api/board/add`)
            .then((res) => { // 응답 객체 전체를 'res'로 받음
                if (res.data == null) { // res.data로 실제 데이터에 접근
                    console.log(`게시물을 추가할 수가 없습니다.`);
                    return;
                }
                console.log("게시물:", res.data);
                return res.data; // 실제 데이터를 반환
            })
            .catch((err) => {
                console.error("통신중 오류 발생", err)
            })
    },

    BothDel: () => {
        return BTOPAPI.get(`/api/board/delete`)
            .then((res) => { // 응답 객체 전체를 'res'로 받음
                if (res.data == null) { // res.data로 실제 데이터에 접근
                    console.log(`게시물을 삭제할 수가 없습니다.`);
                    return;
                }
                console.log("게시물:", res.data);
                return res.data; // 실제 데이터를 반환
            })
            .catch((err) => {
                console.error("통신중 오류 발생", err)
            })
    },
}
