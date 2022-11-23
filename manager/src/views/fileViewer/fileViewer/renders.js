export function renderImage(fileViewer, url){
    return new Promise(( resolve, reject ) => {

        const image = new Image();
        image.addEventListener('load', () => {
            const { width, height } = image;
            const { innerHeight, innerWidth } = window;
            
            if(innerWidth > innerHeight){
                // desktop
                if(width >= height){
                    image.style.width = "60%"
                }else{
                    image.style.height = "60%"
                }
            }else{
                // mobile
                if(width >= height){
                    image.style.width = "90%"
                }else{
                    image.style.height = "60%"
                }
            }
            fileViewer.innerHTML = ''
            fileViewer.appendChild(image);

            resolve()
        })

        image.addEventListener("error", () => {
            reject("Não foi possivel carregar a imagem, por favor tente novamente!")
        })

        image.setAttribute("src", url);
    })
}

export function renderVideoPlayer(fileViewer, url){

    return new Promise(( resolve, reject ) => {

        const video = document.createElement("video");
        
        video.addEventListener('loadeddata', () => {
            if(video.naturalWidth < fileViewer.clientWidth){
                video.style.width = '100%'
            }else{
                video.style.height = '100%'
            }
            fileViewer.innerHTML = ''
            fileViewer.appendChild(video)

            resolve();
        })
        
        video.addEventListener("error", () => {
            reject();
        })
        
        video.setAttribute("autoplay", false);
        video.setAttribute("controls", true);
        video.setAttribute("src", url)
    })
}

export function renderAudioPlayer(fileViewer, url){
    return new Promise(( resolve, reject ) => {
    
        const audio = new Audio(url)

        audio.addEventListener('loadeddata', () => {
            fileViewer.innerHTML = ''
            fileViewer.appendChild(audio)

            resolve();
        })
        
        audio.addEventListener("error", () => {
            reject()
        })
        
        audio.setAttribute("autoplay", false);
        audio.setAttribute("controls", true);
    })
}