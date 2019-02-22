---
title: vana-multi-app
date: 2019-02-21 15:02:78
category: til
---

## version
vue-cli 3.0으로 프로젝트 구성  
vue : 2.5.22  
typescript : 3.0.0  
## 프로젝트 폴더 구조
```
src/
|
|- main.ts                # vue 인스턴스 생성 및 구성(Vue, App, router)
|- router.ts              # router 설정
|- assets                 # 이미지나, css파일들
|- components/            # 컴포넌트들
| |- CommonModal.vue        # 공통 모달 컴포넌트
| |- ImageCropper.vue       # 이미지 크롭 기능 컴포넌트 
| |- TodoInput.vue
| |- TodoList.vue
| ...
|
|- model/
| |- todo.ts
| ...
|
|- views/
| |- ImageView.vue
| |- TodoView.vue
| ...
|
|- App.vue (Main App)
|
```
## pages
- Todo : 할일 등록 (등록, 삭제, 완료 체크 기능)
- Image : 썸네일 등록 (vue-cropperjs 사용)

### 레이아웃 구조  
```md
- Todo - TodoView.vue
|- TodoInput.vue
|- TodoList.vue
- Image - ImageView.vue
|- CommonModal.vue
|- ImageCropper.vue
|- VueCropper
```  

## 라우팅
화면 이동은 router-link to로 이동하며,
'/' path로 호출되는 경우 '/todo' 화면으로 redirect 한다.

## vue-cropper
[vue-cropperjs](https://github.com/agontuk/vue-cropperjs/)  
library : [cropperjs](https://github.com/fengyuanchen/cropperjs)
```html
<vue-cropper
    ref='cropper'
    :guides="true"
    :view-mode="1"
    drag-mode="crop"
    :auto-crop-area="0.5"
    :min-container-width="250"
    :min-container-height="180"
    :background="true"
    :rotatable="true"
    :src="imageSrc"
    :img-style="{ 'width': '360px', 'height': '300px' }">
</vue-cropper>
```
[options](https://github.com/fengyuanchen/cropperjs#options)  
* view-mode 
    * 0(기본값) : 제한 없음
    * 1 : 크롭 박스가 캔버스 크기를 초과하지 않도록 제한
    * 2 : 컨테이너에 맞도록 최소 캔버스 크기를 제한한다. 캔버스와 컨테이너의 비율이 다른 경우 치수중 하나로 맞출 수 있다.
    * 3 : 컨테이너에 맞도록 최소 캔버스 크기 제한한다는 것은 2와 동일하나, 캔버스와 컨테이너의 비율이 다른 경우 치수를 맞출 수 없다.  
    2,3을 실제 적용했을 때 차이점을 정확히는 모르겠으나 전체 사이즈를 맞출수 있느냐 없느냐인 것 같다.
* dragMode
    * crop(기본값) : 크롭 박스를 만든다.
    * move : 캔버스를 이동한다.
    * none : 아무것도 하지 않는다.  

## zoom

```javascript
public zoomIn(e: Event): void {
    const ratio = .2;
    this.zoom(ratio, e);
}
public zoomOut(e: Event): void {
    const ratio = -.2;
    this.zoom(ratio, e);
}
public zoom(zoomRatio: number, event: Event): void {
    const canvasData = this.$refs.cropper.getCanvasData();
    let ratio = zoomRatio;
    if (ratio < 0) {
        ratio = 1 / (1 - ratio);
    } else {
        ratio = 1 + ratio;
    }
    let computedRatio = (canvasData.width * ratio) / canvasData.naturalWidth;
    this.$refs.cropper.zoomTo(computedRatio, event);
}
```
## IE9 대응의 문제
https://html5test.com/compare/browser/ie-9.html


## 문제되는 코드
template
```html
<input clsss="image_file_upload" type="file" name="image_file_input" accept="image/*"
    @change="setImage($event.target.files)"/>
```
setImage method
```javascript
public setImage(files: [any]): void {
// 1. 파일을 요소를 가져옴.
    const file = files[0];
// 2. 이미지 파일인지 체크
    if (!/^image\/\w+$/.test(file.type)) {
        alert('이미지 파일만 올릴 수 있습니다.');
        return;
    }
// 3. 이미지 파일 dataURL 가져오기.
    if (typeof FileReader === 'function') {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          this.imageSrc = event.target.result
          
          // 화면에 이미지 replace
          this.$refs.cropper.replace(this.imageSrc);
        }
      reader.readAsDataURL(file);
    } else {
    alert('이미지 파일을 읽어올 수 없습니다.');
  }
}
```
## 회고
1. typescript를 사용하는 이점을 좀 더 활용 할 수 있었으면 좋겠다.
2. this.$refs.cropper가 가지고 있는 메소드를 사용하려면 vscode 에디터 상에서 에러가 난다.  (Property 'replace' does not exist on type 'Vue'.)
3. TDD를 추가 해 보자.
4. IE9 대응.
