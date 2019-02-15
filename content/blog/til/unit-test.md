---
title: unit test 테스트 개발 환경 설정 (karma, jasmine)
date: 2019-02-14 10:02:09
category: til
---

## 테스트 환경 설정  
> 참고 사이트 : https://meetup.toast.com/posts/126,  
http://blog.jeonghwan.net/tool/2017/03/28/jasmine.html  

테스트 환경 : 테스트 러너 karma 추가   
JS test runner는 karma, protractor 가 있다.  
karma는 Node.js에서 실행되며 테스팅 프레임 워크의 기능은 제공되지 않는다.   
Karma가 동작되는 방식을 요약하면 다음과 같다.  

1. karma 자체 서버를 띄운다.  
2. 사용자가 작성한 테스트 코드와 소스 코드를 karma.config.js에 미리 정의한 테스트 환경(웹 브라우저)의 IFrame 내부로 불러들여 테스트를 실행한다.  
3. 테스트를 모두 수행하고 난 뒤 수행 결과를 karma 서버로 받고, 콘솔을 통해 개발자에게 결과를 보여준다.  

```
$ npm i karma --save-dev  
$ karma init
```

jasmine은 testing framework이다.   
testing framework는 Mocha, Jasmine, Enzyme, Jest, Cucumber, Ava 등이 있다.  

* Jasmine과 Mocha는 지원하는 기능은 비슷하다고 하나, Jasmine이 테스트 수행 속도가 빠르다는 이점이 있다고 한다.  
* Jasmine은 html에 로딩하여 테스트 결과를 브라우저에서 확인하는 방법을 제공한다. karma를 같이 사용하는 이유는 콘솔에서 확인하고 감시하는 옵션의 기능을 사용하기 위함이다. -> Jasmine만 사용해도 되는지는 모르겠어서 이건 확인 후에 얘기 해야 할듯.  

설치 후 karma.conf.js 가 생기는데 설정 해줘야함.  

```javascript
module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      './src/hello.js',
      './test/hello.spec.js'
    ],
    autoWatch: true,
    browsers: ['Chrome'],
  });
}
```

생성한 karma를 실행하려면 karma plugin을 추가해야 한다.  

```bash
$ npm install karma-jasmine karma-chrome-launcher jasmine-core --save-dev
```

karma init 설정으로 karma.config.js 파일을 만들면  
package.json을 확인하면 karma-jasmine, karma-chrome-launcher는 자동으로 설치되어 있다.  

package.json에 추가  
```javascript
"scripts": {
  "test" : "karma start"
},
```

테스트 코드가 들어갈 test용 폴더 생성함  

테스트 할 파일 생성  

./src/hello.js  
```javascript
var Hello = {
  message: 'Hello world',
  greeting() {
    return this.message;
  }
};
```

./test/hello.spec.js  
```javascript
describe('Hello', ()=> {
  describe('greeting', ()=>{
    it('인사 문자열을 반환한다', ()=> {
      const expectedStr = Hello.message,
            actualStr = Hello.greeting();
      expect(actualStr).toBe(expectedStr);
    })
  })
});
```
>
```bash
$ npm run test
```
성공  
이때 파일을 변경해도 계속 변경된 내용으로 테스팅이 실행된다.  
CI환경에서는 한번만 실행되어야 하기때문에 karma 설정을 변경 해줘야한다.  
karma.config.js  
```javascript
singleRun: false, // false면 계속 실행, true면 한번만 실행
```
or  
package.json에서 스크립트에 옵션을 주는 방법 (http://karma-runner.github.io/3.0/config/configuration-file.html)  
```javascript
 "scripts": {
    "dev-test": "karma start --no-single-run",
    "test": "karma start --single-run"
  },
```
## 본격적인 테스트의 시작
단위 테스트 케이스는 어떻게 작성하느냐?  
Java는 Class 혹은 Method가 단위가 될 수 있고 JS나 Python은 Function이 될 수 있다.  
5가지의 테스트 더블 (Double이란 '대역'을 의미한다)  
출처 : http://xunitpatterns.com/Test%20Double.html, [김정환블로그](http://blog.jeonghwan.net/tool/2017/03/28/jasmine.html)
> 더미(dummy): 파라매터로 사용되며 전달만하고 실제 사용하지는 않는다.  
> 스텁(stub): 더미를 좀 더 구현하여 아직 개발하지 않은 메서드가 실제 작동하는 것처럼 보이게 만든 객체이다.  
> 스파이(spy): 스텁과 비슷하지만 내부적으로 기록을 남긴다는 점이 다르다. 특정 메서드가 호출되었는지 등의 상황을 감시(spying)한다.  
> 모의체(fake): 스텝에서 좀 더 발전하여 실제로 간단히 구현된 코드를 갖고 있지만, 운영 환경에서 사용할 수는 없는 객체다  
> 모형(mock): 더미, 스텁, 스파이를 혼합한 형태와 비슷하나 행위를 검증하는 용도로 주로 사용된다.  

### 스파이 테스트 (https://jasmine.github.io/api/edge/Spy.html)  
hello.js는 그대로 두고, hello.spec.js를 변경했다.  

```javascript
describe('Hello모듈의', ()=> {
  describe('greeting함수는', ()=>{
    it('getName 함수을 호출한다', ()=> {
      spyOn(Hello, 'getName');
      Hello.greeting();
      expect(Hello.getName).toHaveBeenCalled();
    })
  })
});
```

그러고 npm run dev-test  

expect에서 호출한 hello.getName 메서드가 없다는 에러가 뜬다.   
hello.js 변경 후 테스트 통과함.  

```javascript
var Hello = {
  message: 'Hello',
  greeting() {
    return `this.message ${this.getName()}`;
  },
  getName() {
    return 'World';
  }
};
```  

### AJAX 테스트  
Jasmine에서 ajax 테스트를 위한 jasmin-ajax 라이브러리를 제공한다.  
karma로 Jasmine을 사용하면 karma-jasmine-ajax 플러그인을 사용하면 된다.  

```bash
$ npm i karma-jasmine-ajax --save-dev
```

karma.conf.js 주의 : 순서가 바뀌면 안된다.  
```javascript
frameworks: ['jasmine-ajax', 'jasmine'],
```
    
hello.spec.js
```javascript
describe('Hello', ()=> {
  describe('getName함수는', ()=>{
    let request;
    // 실행 전의 환경 구성
    beforeEach(()=> {
      jasmine.Ajax.install(); // Ajax 요청을 캡쳐하기 위한 mock을 만드는 역할
      Hello.getName();
      request = jasmine.Ajax.requests.mostRecent(); // 요청 결과 저장
    });
    // 테스트 케이스 종료 후 정리 작업
    afterEach(()=> jasmine.Ajax.uninstall());

    it('HTTP 요청을 보낸다', () => {
      const expectUrl = 'http://name';
      expect(request.url).toBe(expectUrl);
    });
  });
});
```

beforeEach -> it -> afterEach 순으로 실행된다.
