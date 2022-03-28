document.addEventListener('DOMContentLoaded', () => {
    Initialize();
});

const state = {
    selected: HTMLElement,
    color: Number
}

const Initialize = () => {
    
    InitializeMenu();
    getRepositories();
    InitializeEffects();
    InitializeColorSchemes();
}

const InitializeEffects = () => {
    const floatingEffects = [
        {element: document.getElementById('MAIN'), multiplier: {x: 0.03, y: 0.03}, offset: {x: 0, y: 0}},
        {element: document.getElementById('DETAIL'), multiplier: {x: 0, y: 0.02}, offset: {x: 0, y: 0}},
    ]

    const parallaxEffects = [
        {element: document.getElementById('DETAIL'), multiplier: 0.9, offset: 0},
    ]


    let windowSize = {width: window.innerWidth, height: window.innerWidth}

    document.addEventListener('resize', () => {
        reSize();
    });

    document.addEventListener('scroll', () => {
        parallaxScroll();
    });

    document.addEventListener('mousemove', (e) => {
        floatingEffect(e);
    });

    const parallaxScroll = () => {
        if(windowSize.width > 750 ) return;
        
        const distance = window.scrollY;
        parallaxEffects.forEach(effect => {
            effect.element.style.marginTop= `${((distance*effect.multiplier) / 2) - effect.offset}px`;
        });
    }

    const floatingEffect = (e) => {
        if(windowSize.width <= 1300){ return; }

        const pos = {x: (windowSize.width / 2 -  e.pageX), y: -(windowSize.height / 2 - e.pageY)};

        floatingEffects.forEach(effect => {
            effect.element.style.marginBottom = `${effect.offset.y +  pos.y * effect.multiplier.y}px`;
            effect.element.style.marginLeft = `${effect.offset.x + pos.x * effect.multiplier.x}px`;
        });
    }

    const reSize = () => {
        windowSize = {width: window.innerWidth, height: window.innerWidth}
    }

}

const InitializeMenu = () => {
    const CONTAINER = document.getElementById('content');

    const ABOUT = document.getElementById('ABOUT-ME');
    const GITHUB = document.getElementById('GITHUB');
    const CONTACT = document.getElementById('CONTACT-ME');
    
    const aboutSection = document.getElementById('about-me');
    const githubSection = document.getElementById('github');
    const contactSection = document.getElementById('contact-me')

    state.selected = ABOUT.parentElement;

    ABOUT.parentElement.addEventListener('click', () => onMenuClick(ABOUT));
    GITHUB.parentElement.addEventListener('click', () => onMenuClick(GITHUB));
    CONTACT.parentElement.addEventListener('click', () => onMenuClick(CONTACT));

    const onMenuClick = (element = HTMLElement) => {
        state.selected.classList.remove('selected');

        element.parentElement.className = 'selected';
        state.selected = element.parentElement;
        
        switch(element.id){
            case 'ABOUT-ME':
                aboutSection.scrollIntoView({behavior: "smooth"});
                break;
            case 'GITHUB':
                githubSection.scrollIntoView({behavior: "smooth"});
                break;
            case 'CONTACT-ME':
                contactSection.scrollIntoView({behavior: "smooth"});
                break;
        }
        
    }

}

const InitializeColorSchemes = () => {
    state.color = Number.isNaN(Number.parseInt(localStorage.getItem('color-scheme'))) ? 2 : Number.parseInt(localStorage.getItem('color-scheme'));

    console.log(state.color);
    const EFFECT_LIGHT = document.getElementById('EFFECT-LIGHT');
    const EFFECT_HUE = document.getElementById('EFFECT-HUE');
    const SWITCH = document.getElementById('SWITCH');

    const EFFECT_LABELS = [
        'LIGHT',
        'PINK',
        'DARK'
    ]
    
    EFFECT_LIGHT.style.display = 'unset';
    EFFECT_HUE.style.display = 'unset';
    
    SWITCH.addEventListener('click', () => { state.color = state.color == 2 ? 0 : state.color + 1; switchColorScheme();});
    
    const switchColorScheme = () => {
        switch (state.color) {
            case 0:
                setLightMode(true);
                break;
            case 1:
                setLightMode(false);
                setHueRotation(true);
                break;
            case 2:
                setHueRotation(false);
                break;
        }
        SWITCH.textContent = `Mode: ${EFFECT_LABELS[state.color]}`;
        localStorage.setItem('color-scheme', state.color);
    }
                
    const setLightMode = (value) => {
        EFFECT_LIGHT.style.transform = value ? 'scaleX(1)' : 'scaleX(0)';

        // Ignore global github color by setting it inverted
        document.documentElement.style.setProperty('--aqua-github', value ? '#ac640a' : '#539bf5');
        document.documentElement.style.setProperty('--aqua-github-lighter', value ? '#673900' : '#98c6ff');
    }
    
    const setHueRotation = (value) => {
        EFFECT_HUE.style.transform = value ? 'scaleX(1)' : 'scaleX(0)';
    }

    switchColorScheme();
}


const getRepositories = async () => {
    const count = 12;
    const sort = 'created';

    const url = `https://api.github.com/users/TuuKeZu/repos?per_page=${count}&sort=${sort}&direction=desc`;

    const response = await fetch(url);
    const repositories = await response.json();
    
    repositories.filter(repo => !repo.fork && !repo.description == '').forEach(repo => {
        appendRepository(repo);
    });
    
}

const appendRepository = (repository = {}) => {
    const root = document.getElementById('REPOSITORIES');
    
    const parent = document.createElement('div');
    parent.className = 'repo-item';
    
    const title = document.createElement('h2');
    title.textContent = repository.name;
    
    const description = document.createElement('h6');
    description.textContent = repository.description;
    
    parent.appendChild(title);
    parent.appendChild(description);
    
    repository.topics.forEach(topic => {
        const tag = document.createElement('h5');
        tag.textContent = topic;
        parent.appendChild(tag);
    });

    root.appendChild( document.createElement('div').appendChild(parent) );
}
