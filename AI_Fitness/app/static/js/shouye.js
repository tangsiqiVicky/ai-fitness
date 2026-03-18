// 当文档加载完成后初始化Vue应用
document.addEventListener('DOMContentLoaded', function() {
    // 获取图片基础URL路径
    let staticUrl = '';
    try {
        const metaTag = document.querySelector('meta[name="static-url"]');
        if (metaTag) {
            staticUrl = metaTag.getAttribute('content');
            console.log('获取到静态URL:', staticUrl);
        } else {
            console.error('找不到静态URL meta标签');
            // 使用备用路径
            staticUrl = '/static/';
        }
    } catch (error) {
        console.error('获取静态URL时出错:', error);
        // 使用备用路径
        staticUrl = '/static/';
    }
    
    const app = new Vue({
        el: '#app',
        data: {
            currentSlide: 0,
            currentTestimonial: 0,
            autoSlideInterval: null,
            autoTestimonialInterval: null,
            stats: {
                courses: 0,
                trainers: 0,
                users: 3
            },
            features: [
                { text: '个性化训练计划' },
                { text: '专业营养指导' },
                { text: '实时康训数据追踪' }
            ],
            slides: [
                { 
                    image: staticUrl + 'img/fitness-hero.avif',
                    alt: "康训形象1",
                    fallback: "this.src='https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'; this.onerror=null;"
                },
                {
                    image: staticUrl + 'img/fitness-hero2.avif',
                    alt: "康训形象2",
                    fallback: "this.src='https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'; this.onerror=null;"
                },
                {
                    image: staticUrl + 'img/fitness-hero3.avif',
                    alt: "康训形象3",
                    fallback: "this.src='https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'; this.onerror=null;"
                }
            ],
            courses: [
                {
                    title: '高强度间歇训练',
                    description: '快速燃脂，提高心肺功能的高效训练方式',
                    image: staticUrl + 'img/course1.avif',
                    fallback: "this.src='https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'; this.onerror=null;",
                    level: '中级',
                    duration: '45分钟',
                    calories: '450'
                },
                {
                    title: '力量训练基础',
                    description: '增强肌肉力量，塑造完美体型的基础训练',
                    image: staticUrl + 'img/course2.avif',
                    fallback: "this.src='https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'; this.onerror=null;",
                    level: '初级',
                    duration: '60分钟',
                    calories: '350'
                },
                {
                    title: '瑜伽冥想',
                    description: '放松身心，提高柔韧性和平衡能力的瑜伽课程',
                    image: staticUrl + 'img/course3.avif',
                    fallback: "this.src='https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'; this.onerror=null;",
                    level: '全级别',
                    duration: '75分钟',
                    calories: '250'
                },
                {
                    title: '康复理疗',
                    description: '针对运动损伤和慢性疼痛的专业康复训练课程',
                    image: staticUrl + 'img/course4.avif',
                    fallback: "this.src='https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'; this.onerror=null;",
                    level: '全级别',
                    duration: '50分钟',
                    calories: '200'
                }
            ],
            doctors: [
                {
                    name: '李志远 医师',
                    specialty: '运动康复科主任',
                    bio: '北京协和医学院博士，专注运动损伤康复与骨科康复，15年临床经验',
                    credential: '主任医师',
                    image: staticUrl + 'img/doctor1.avif',
                    fallback: "this.src='https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'; this.onerror=null;"
                },
                {
                    name: '王雅琪 医师',
                    specialty: '神经康复科专家',
                    bio: '复旦大学医学硕士，擅长脑卒中、脊髓损伤等神经系统康复治疗',
                    credential: '副主任医师',
                    image: staticUrl + 'img/doctor2.avif',
                    fallback: "this.src='https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'; this.onerror=null;"
                },
                {
                    name: '陈明华 医师',
                    specialty: '中医康复科专家',
                    bio: '中医药大学博士，结合传统中医与现代康复技术，擅长颈椎腰椎康复',
                    credential: '主治医师',
                    image: staticUrl + 'img/doctor3.avif',
                    fallback: "this.src='https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'; this.onerror=null;"
                },
                {
                    name: '张慧敏 医师',
                    specialty: '骨科康复专家',
                    bio: '上海交通大学医学博士，专注骨折术后康复与关节置换康复，12年临床经验',
                    credential: '副主任医师',
                    image: staticUrl + 'img/doctor4.avif',
                    fallback: "this.src='https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'; this.onerror=null;"
                }
            ],
            testimonials: [
                {
                    quote: '加入智体康训是我做过的最好的决定之一。专业的教练和个性化的训练计划帮助我在短时间内达到了理想的康训效果。',
                    name: '张先生',
                    title: '会员 · 6个月',
                    avatar: staticUrl + 'img/user1.jpg',
                    fallback: "this.src='https://randomuser.me/api/portraits/men/32.jpg'; this.onerror=null;"
                },
                {
                    quote: '教练们非常专业和耐心，不仅教授正确的训练方法，还提供了很多健康饮食的建议，让我的康训之旅变得更加轻松和有效。',
                    name: '李女士',
                    title: '会员 · 1年',
                    avatar: staticUrl + 'img/user2.jpg',
                    fallback: "this.src='https://randomuser.me/api/portraits/women/44.jpg'; this.onerror=null;"
                },
                {
                    quote: '智体康训的环境非常好，设备齐全，而且很干净。最重要的是，这里的社区氛围非常棒，让我每次锻炼都充满动力。',
                    name: '王先生',
                    title: '会员 · 3个月',
                    avatar: staticUrl + 'img/user3.jpg',
                    fallback: "this.src='https://randomuser.me/api/portraits/men/62.jpg'; this.onerror=null;"
                }
            ],
            contactForm: {
                name: '',
                email: '',
                phone: '',
                message: ''
            }
        },
        methods: {
            nextSlide() {
                console.log('下一张幻灯片');
                this.currentSlide = (this.currentSlide + 1) % this.slides.length;
            },
            prevSlide() {
                console.log('上一张幻灯片');
                this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            },
            goToSlide(index) {
                console.log('跳转到幻灯片', index);
                this.currentSlide = index;
            },
            nextTestimonial() {
                this.currentTestimonial = (this.currentTestimonial + 1) % this.testimonials.length;
            },
            goToTestimonial(index) {
                this.currentTestimonial = index;
            },
            submitForm() {
                // 这里可以添加表单提交逻辑
                alert('感谢您的留言，我们会尽快与您联系！');
                this.contactForm = {
                    name: '',
                    email: '',
                    phone: '',
                    message: ''
                };
            },
            // 手动更新轮播图
            updateCarousel() {
                console.log('更新轮播图，当前索引:', this.currentSlide);
                // 可以在这里添加额外的轮播图更新逻辑
            }
        },
        watch: {
            // 监听currentSlide变化
            currentSlide: function(newVal) {
                console.log('幻灯片索引变化为:', newVal);
                this.updateCarousel();
            }
        },
        mounted() {
            console.log('Vue实例已挂载');
            console.log('轮播图初始化，幻灯片数量:', this.slides.length);
            
            // 自动轮播
            this.autoSlideInterval = setInterval(() => {
                this.nextSlide();
            }, 3000);
            
            this.autoTestimonialInterval = setInterval(() => {
                this.nextTestimonial();
            }, 8000);
        },
        beforeDestroy() {
            clearInterval(this.autoSlideInterval);
            clearInterval(this.autoTestimonialInterval);
        }
    });
    
    // 导出Vue实例供调试使用
    window.app = app;
});