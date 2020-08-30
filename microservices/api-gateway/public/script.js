Vue.component('app-header', {
    props: ['search', 'auth'],
    data: function() {
		return {
			value: ''
		}
	},
	template: `
    <div class="header">
        <a href="#" class="header__logo">Photo Stock</a>
        <form action="#" class="header__search" @submit.prevent="$emit('search-change', value)">
            <input type="text" class="input" placeholder="Search free photos" :value="search" @input="value = $event.target.value">
            <button class="header__search-button">
                <svg enable-background="new 0 0 60 60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="m55.146 51.887-13.558-14.101c3.486-4.144 5.396-9.358 5.396-14.786 0-12.682-10.318-23-23-23s-23 10.318-23 23 10.318 23 23 23c4.761 0 9.298-1.436 13.177-4.162l13.661 14.208c.571.593 1.339.92 2.162.92.779 0 1.518-.297 2.079-.837 1.192-1.147 1.23-3.049.083-4.242zm-31.162-45.887c9.374 0 17 7.626 17 17s-7.626 17-17 17-17-7.626-17-17 7.626-17 17-17z"/></svg>
            </button>
        </form>
        <a v-if="auth.token" href="#" class="header__button button" @click.prevent="$emit('open-popup', 'upload')">
            <svg enable-background="new 0 0 486.3 486.3" viewBox="0 0 486.3 486.3" xmlns="http://www.w3.org/2000/svg" fill="#fff"><path d="m395.5 135.8c-5.2-30.9-20.5-59.1-43.9-80.5-26-23.8-59.8-36.9-95-36.9-27.2 0-53.7 7.8-76.4 22.5-18.9 12.2-34.6 28.7-45.7 48.1-4.8-.9-9.8-1.4-14.8-1.4-42.5 0-77.1 34.6-77.1 77.1 0 5.5.6 10.8 1.6 16-27.5 20-44.2 52.2-44.2 86.5 0 27.7 10.3 54.6 29.1 75.9 19.3 21.8 44.8 34.7 72 36.2h.8 86c7.5 0 13.5-6 13.5-13.5s-6-13.5-13.5-13.5h-85.6c-40.9-2.5-75.3-41.4-75.3-85.2 0-28.3 15.2-54.7 39.7-69 5.7-3.3 8.1-10.2 5.9-16.4-2-5.4-3-11.1-3-17.2 0-27.6 22.5-50.1 50.1-50.1 5.9 0 11.7 1 17.1 3 6.6 2.4 13.9-.6 16.9-6.9 18.7-39.7 59.1-65.3 103-65.3 59 0 107.7 44.2 113.3 102.8.6 6.1 5.2 11 11.2 12 44.5 7.6 78.1 48.7 78.1 95.6 0 49.7-39.1 92.9-87.3 96.6h-73.7c-7.5 0-13.5 6-13.5 13.5s6 13.5 13.5 13.5h74.2 1c30.5-2.2 59-16.2 80.2-39.6 21.1-23.2 32.6-53 32.6-84-.1-56.1-38.4-106-90.8-119.8z"/><path d="m324.2 280c5.3-5.3 5.3-13.8 0-19.1l-71.5-71.5c-2.5-2.5-6-4-9.5-4s-7 1.4-9.5 4l-71.5 71.5c-5.3 5.3-5.3 13.8 0 19.1 2.6 2.6 6.1 4 9.5 4s6.9-1.3 9.5-4l48.5-48.5v222.9c0 7.5 6 13.5 13.5 13.5s13.5-6 13.5-13.5v-222.9l48.5 48.5c5.2 5.3 13.7 5.3 19 0z"/></svg>
            <span>Upload</span>
        </a>
        <a v-if="auth.token" href="#" class="header__button button" @click.prevent="$emit('sign-out')">
            <svg enable-background="new 0 0 330 330" viewBox="0 0 330 330" xmlns="http://www.w3.org/2000/svg" fill="#fff"><path d="m51.213 180h173.785c8.284 0 15-6.716 15-15s-6.716-15-15-15h-173.785l19.394-19.393c5.858-5.857 5.858-15.355 0-21.213-5.856-5.858-15.354-5.858-21.213 0l-44.997 44.997c-.348.347-.676.71-.988 1.09-.076.093-.141.193-.215.288-.229.291-.454.583-.66.891-.06.09-.109.185-.168.276-.206.322-.408.647-.59.986-.035.067-.064.138-.099.205-.189.367-.371.739-.53 1.123-.02.047-.034.097-.053.145-.163.404-.314.813-.442 1.234-.017.053-.026.108-.041.162-.121.413-.232.83-.317 1.257-.025.127-.036.258-.059.386-.062.354-.124.708-.159 1.069-.051.495-.076.995-.076 1.497s.025 1.002.076 1.498c.035.366.099.723.16 1.08.022.124.033.251.058.374.086.431.196.852.318 1.269.015.049.024.101.039.15.129.423.28.836.445 1.244.018.044.031.091.05.135.16.387.343.761.534 1.13.033.065.061.133.095.198.184.341.387.669.596.994.056.088.104.181.162.267.207.309.434.603.662.895.073.094.138.193.213.285.313.379.641.743.988 1.09l44.997 44.997c2.929 2.93 6.768 4.394 10.607 4.394s7.678-1.464 10.606-4.394c5.858-5.858 5.858-15.355 0-21.213z"/><path d="m207.299 42.299c-40.944 0-79.038 20.312-101.903 54.333-4.62 6.875-2.792 16.195 4.083 20.816 6.876 4.62 16.195 2.794 20.817-4.083 17.281-25.715 46.067-41.067 77.003-41.067 51.115.001 92.701 41.586 92.701 92.702s-41.586 92.701-92.701 92.701c-30.845 0-59.584-15.283-76.878-40.881-4.639-6.865-13.961-8.669-20.827-4.032-6.864 4.638-8.67 13.962-4.032 20.826 22.881 33.868 60.913 54.087 101.737 54.087 67.657 0 122.701-55.043 122.701-122.701s-55.044-122.701-122.701-122.701z"/></svg>
            <span>Sign Out</span>
        </a>
        <a v-else href="#" class="header__button button" @click.prevent="$emit('open-popup', 'auth')">
            <svg enable-background="new 0 0 482.9 482.9" viewBox="0 0 482.9 482.9" xmlns="http://www.w3.org/2000/svg" fill="#fff"><path d="m239.7 260.2h1.6.6 1c29.3-.5 53-10.8 70.5-30.5 38.5-43.4 32.1-117.8 31.4-124.9-2.5-53.3-27.7-78.8-48.5-90.7-15.5-8.9-33.6-13.7-53.8-14.1h-.7c-.1 0-.3 0-.4 0h-.6c-11.1 0-32.9 1.8-53.8 13.7-21 11.9-46.6 37.4-49.1 91.1-.7 7.1-7.1 81.5 31.4 124.9 17.4 19.7 41.1 30 70.4 30.5zm-75.1-152.9c0-.3.1-.6.1-.8 3.3-71.7 54.2-79.4 76-79.4h.4.8c27 .6 72.9 11.6 76 79.4 0 .3 0 .6.1.8.1.7 7.1 68.7-24.7 104.5-12.6 14.2-29.4 21.2-51.5 21.4-.2 0-.3 0-.5 0-.2 0-.3 0-.5 0-22-.2-38.9-7.2-51.4-21.4-31.7-35.6-24.9-103.9-24.8-104.5z"/><path d="m446.8 383.6c0-.1 0-.2 0-.3 0-.8-.1-1.6-.1-2.5-.6-19.8-1.9-66.1-45.3-80.9-.3-.1-.7-.2-1-.3-45.1-11.5-82.6-37.5-83-37.8-6.1-4.3-14.5-2.8-18.8 3.3s-2.8 14.5 3.3 18.8c1.7 1.2 41.5 28.9 91.3 41.7 23.3 8.3 25.9 33.2 26.6 56 0 .9 0 1.7.1 2.5.1 9-.5 22.9-2.1 30.9-16.2 9.2-79.7 41-176.3 41-96.2 0-160.1-31.9-176.4-41.1-1.6-8-2.3-21.9-2.1-30.9 0-.8.1-1.6.1-2.5.7-22.8 3.3-47.7 26.6-56 49.8-12.8 89.6-40.6 91.3-41.7 6.1-4.3 7.6-12.7 3.3-18.8s-12.7-7.6-18.8-3.3c-.4.3-37.7 26.3-83 37.8-.4.1-.7.2-1 .3-43.4 14.9-44.7 61.2-45.3 80.9 0 .9 0 1.7-.1 2.5v.3c-.1 5.2-.2 31.9 5.1 45.3 1 2.6 2.8 4.8 5.2 6.3 3 2 74.9 47.8 195.2 47.8s192.2-45.9 195.2-47.8c2.3-1.5 4.2-3.7 5.2-6.3 5-13.3 4.9-40 4.8-45.2z"/></svg>
            <span>Sign In / Up</span>
        </a>
    </div>`
})

Vue.component('app-tags', {
    props: ['search', 'tags'],
	template: `
    <div class="tags">
        <a href="#" v-for="tag in tags" class="tags__item" :class="{ active: tag == search }" @click.prevent="$emit('search-change', tag)">#{{ tag }}</a>
    </div>`
})

Vue.component('app-posts', {
    props: ['photos'],
	template: `
    <div class="posts">
        <div v-for="photo in photos" class="posts__item">
            {{ photo }}
            <a :href="photo.image" data-fancybox="gallery" class="posts__item-image" :style="{ backgroundImage: 'url(' + photo.image + ')' }"></a>
            <span class="posts__item-author">Author: {{ photo.author }}</span>
            <a :href="photo.original" download="" class="posts__item-download button">
                <svg enable-background="new 0 0 471.2 471.2" viewBox="0 0 471.2 471.2" xmlns="http://www.w3.org/2000/svg" fill="#fff"><path d="m457.7 230.15c-7.5 0-13.5 6-13.5 13.5v122.8c0 33.4-27.2 60.5-60.5 60.5h-296.2c-33.4 0-60.5-27.2-60.5-60.5v-124.8c0-7.5-6-13.5-13.5-13.5s-13.5 6-13.5 13.5v124.8c0 48.3 39.3 87.5 87.5 87.5h296.2c48.3 0 87.5-39.3 87.5-87.5v-122.8c0-7.4-6-13.5-13.5-13.5z"/><path d="m226.1 346.75c2.6 2.6 6.1 4 9.5 4s6.9-1.3 9.5-4l85.8-85.8c5.3-5.3 5.3-13.8 0-19.1s-13.8-5.3-19.1 0l-62.7 62.8v-273.9c0-7.5-6-13.5-13.5-13.5s-13.5 6-13.5 13.5v273.9l-62.8-62.8c-5.3-5.3-13.8-5.3-19.1 0s-5.3 13.8 0 19.1z"/></svg>
            </a>
        </div>
    </div>`
})

Vue.component('popup-auth', {
	props: ['error'],
	data: function() {
		return {
			type: 'sign-in',
			username: '',
			email: '',
			password: ''
		}
	},
	template: `
    <div class="popup active">
        <div class="popup__container">
            <div class="popup__body">
                <a @click.prevent="$emit('close')" href="#" class="popup__close">
                    <svg enable-background="new 0 0 212.982 212.982" viewBox="0 0 212.982 212.982" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="m131.804 106.491 75.936-75.936c6.99-6.99 6.99-18.323 0-25.312-6.99-6.99-18.322-6.99-25.312 0l-75.937 75.937-75.937-75.938c-6.99-6.99-18.322-6.99-25.312 0-6.989 6.99-6.989 18.323 0 25.312l75.937 75.936-75.937 75.937c-6.989 6.99-6.989 18.323 0 25.312 6.99 6.99 18.322 6.99 25.312 0l75.937-75.937 75.937 75.937c6.989 6.99 18.322 6.99 25.312 0s6.99-18.322 0-25.312z" fill-rule="evenodd"/></svg>
                </a>
                <div class="popup__body-toggle">
                    <a href="#" class="popup__body-toggle-link" :class="{ active: type == 'sign-in' }" @click.prevent="() => type = 'sign-in'">Sign In</a>
                    <span> | </span>
                    <a href="#" class="popup__body-toggle-link" :class="{ active: type == 'sign-up' }" @click.prevent="() => type = 'sign-up'">Sign Up</a>
                </div>
                <span class="error">{{ error }}</span>
                <form v-if="type == 'sign-in'" action="#" class="popup__body-form">
                    <input type="text" class="input" placeholder="e-mail" v-model="email" required>
                    <input type="password" class="input" placeholder="password" v-model="password" required>
                    <button class="button" @click.prevent="$emit('sign-in', {email,password})">Sign In</button>
                </form>
                <form v-else action="#" class="popup__body-form">
                    <input type="text" class="input" placeholder="username" v-model="username" required>
                    <input type="text" class="input" placeholder="e-mail" v-model="email" required>
                    <input type="password" class="input" placeholder="password" v-model="password" required>
                    <button class="button" @click.prevent="$emit('sign-up', {username,email,password})">Sign Up</button>
                </form>
            </div>
        </div>
        <a href="#" class="popup__overlay"></a>
    </div>`
})

Vue.component('popup-upload', {
    props: ['error'],
	data: function() {
		return {
			tags: '',
			image: ''
		}
    },
    methods: {
        processFile(event) {
            var reader = new FileReader()
            reader.readAsDataURL(event.target.files[0])
            reader.onload = () => {
                this.image = reader.result
            }
        }
    },
	template: `
    <div class="popup active">
        <div class="popup__container">
            <div class="popup__body">
                <a @click.prevent="$emit('close')" href="#" class="popup__close">
                    <svg enable-background="new 0 0 212.982 212.982" viewBox="0 0 212.982 212.982" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="m131.804 106.491 75.936-75.936c6.99-6.99 6.99-18.323 0-25.312-6.99-6.99-18.322-6.99-25.312 0l-75.937 75.937-75.937-75.938c-6.99-6.99-18.322-6.99-25.312 0-6.989 6.99-6.989 18.323 0 25.312l75.937 75.936-75.937 75.937c-6.989 6.99-6.989 18.323 0 25.312 6.99 6.99 18.322 6.99 25.312 0l75.937-75.937 75.937 75.937c6.989 6.99 18.322 6.99 25.312 0s6.99-18.322 0-25.312z" fill-rule="evenodd"/></svg>
                </a>
                <span class="error">{{ error }}</span>
                <form action="#" class="popup__body-form">
                    <label class="file-input" :style="{ backgroundImage: 'url(' + image + ')' }">
                        <input type="file" class="file-input__native" @change="processFile($event)">
                        <div class="file-input__overlay">
                            <span class="file-input__overlay-content">Insert your image here</span>
                        </div>
                    </label>
                    <input type="text" class="input" placeholder="tags (space separated)" v-model="tags" required>
                    <button class="button" @click.prevent="$emit('upload-image', {image,tags:tags.split(',').map(i => i.trim())})">Upload</button>
                </form>
            </div>
        </div>
        <a href="#" class="popup__overlay"></a>
    </div>`
})

Vue.component('app', {
	data: function() {
		return {
			error: '',
			auth: {},
			page: 1,
			search: '',
			tags: [],
			photos: [],
			popup: '',
			authPopup: {
				username: '',
				email: '',
				password: ''
			},
			uploadPopup: {
				image: '',
				tags: ''
			}
		}
	},
	created: async function() {
		const auth = JSON.parse(Cookies.get('auth') || '{}')
		if (auth) this.auth = auth

		this.search = window.location.hash.substring(1)

		const { photos } = await fetch('/photos').then(res => res.json())
		this.photos = photos

		const { tags } = await fetch('/tags').then(res => res.json())
		this.tags = tags
	},
	methods: {
		setSearch: function(search) {
            this.search = search
            this.page = 0
            this.photos = []
            this.error = ''
            this.nextPage()
		},
		nextPage: async function() {
			try {
                this.page++
                let query = '/photos/' + this.page
                if (this.search.length > 0) query = '/photos/search/' + this.page + '?q=' + this.search
				const { photos } = await fetch(query).then(
					res => res.json()
				)
				this.photos.push(...photos)
			} catch (err) {
				console.warn(err)
			}
		},
		openPopup: function(popup) {
			this.popup = popup
		},
		closePopup: function() {
			this.popup = ''
		},
		signIn: async function(data) {
			try {
				const auth = await fetch('/sign-in', {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(data)
				}).then(res => res.json())
                if (auth.error) return (this.error = auth.error)
                this.error = ''
                this.popup = ''
				this.auth = auth
				Cookies.set('auth', JSON.stringify(auth))
			} catch (err) {
				this.error = err
			}
		},
		signUp: async function(data) {
			try {
				const auth = await fetch('/sign-up', {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(data)
				}).then(res => res.json())
                if (auth.error) return (this.error = auth.error)
                this.error = ''
                this.popup = ''
				this.auth = auth
				Cookies.set('auth', JSON.stringify(auth))
			} catch (err) {
				this.error = err
			}
		},
		SignOut: function() {
			Cookies.remove('auth')
			this.auth = {}
        },
        uploadImage: async function(data) {
            try {
                this.error = ''
				const res = await fetch('/photos', {
					method: 'POST',
					headers: {
						Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: this.auth.token
					},
					body: JSON.stringify(data)
				}).then(res => res.json())
                if (res.error) return (this.error = auth.error)
                this.photos.unshift(res)
                this.popup = ''
                // document.location.reload()
			} catch (err) {
				this.error = err
			}
        }
	},
	template: `
    <div class="app">
        <app-header :search="search" :auth="auth" @search-change="setSearch" @open-popup="openPopup" @sign-out="SignOut" />
        <app-tags :search="search" @search-change="setSearch" :tags="tags" />
        <app-posts :photos="photos" />
        <popup-auth v-if="popup=='auth'" @close="closePopup" @sign-in="signIn" @sign-up="signUp" :error="error" />
        <popup-upload v-if="popup=='upload'" @close="closePopup" @upload-image="uploadImage" :error="error" />
        <span class="footer">Illia Chirkov © 2019</span>
    </div>`
})

const app = new Vue({
	el: '#app',
	render: h => h(Vue.component('app'))
}).$children[0]
