import { Injectable } from '@angular/core';
import { Ad } from '../../shared/ad.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  getAds(): Ad[] {
    throw new Error('Method not implemented.');
  }
  
  private advertisements: Ad[] = [
    {
      id: 1,
      title: 'Гитара Fender',
      price: 20000,
      imageUrl: 'assets/images/guitar_fender.jpg',
      galleryImages: [
        'assets/images/guitar_fender.jpg',
        'assets/images/guitar_fender.jpg',
        'assets/images/guitar_fender.jpg'
      ],
      location: 'Москва',
      date: '21 августа 16:03',
      description: 'Продаю электрогитару Fender Stratocaster в отличном состоянии. Использовалась для домашних занятий. В комплекте чехол, ремни и медиаторы. Идеальный вариант для начинающих гитаристов.'
    },
    {
      id: 2,
      title: 'Ford Mustang 5.0 AT, 2019, 60 000 км',
      price: 3500000,
      imageUrl: 'assets/images/ford_mustang.jpg',
      galleryImages: [
        'assets/images/ford_mustang.jpg',
        'assets/images/ford_mustang.jpg'
      ],
      location: 'Москва',
      date: '21 августа 16:03',
      description: 'Продаю Mustang 5.0 V8 2019 года. Автомат, полный привод, 460 л.с. Пробег 60 000 км. Состояние идеальное, обслуживался в официальном сервисе. Комплектация Premium, кожаный салон, мультимедиа SYNC 3, навигация.'
    },
    {
      id: 3,
      title: 'iPhone 13 mini, 128 ГБ',
      price: 13980,
      imageUrl: 'assets/images/iphone_13_mini.jpg',
      galleryImages: [
        'assets/images/iphone_13_mini.jpg',
        'assets/images/iphone_13_mini.jpg'
      ],
      location: 'Новосибирск',
      date: '21 августа 16:03',
      description: 'Продаю iPhone 13 mini 128 ГБ в синем цвете. Состояние отличное, без царапин и сколов. Замена экрана по гарантии в декабре 2023. В комплекте коробка, зарядное устройство и наушники. Работает на iOS 17.'
    },
    {
      id: 4,
      title: 'Кофемашина DeLonghi',
      price: 35000,
      imageUrl: 'assets/images/coffee_machine_delonghi.jpg',
      galleryImages: [
        'assets/images/coffee_machine_delonghi.jpg'
      ],
      location: 'Санкт-Петербург',
      date: '21 августа 16:03',
      description: 'DeLonghi Nespresso Vertuo Next. Использовалась всего 6 месяцев, в отличном состоянии. Подключается к Wi-Fi, управление через приложение. В комплекте 20 капсул. Идеально для любителей кофе.'
    },
    {
      id: 5,
      title: 'Sony PlayStation 5',
      price: 45000,
      imageUrl: 'assets/images/ps5.jpg',
      galleryImages: [
        'assets/images/ps5.jpg',
        'assets/images/ps5.jpg'
      ],
      location: 'Москва',
      date: '21 августа 16:03',
      description: 'PlayStation 5 Digital Edition в идеальном состоянии. Использовалась с защитным чехлом. В комплекте: консоль, контроллер DualSense, кабели, подставка. Поставляется с 2 играми: Spider-Man 2 и God of War Ragnarök (на цифровых носителях).'
    },
    {
      id: 6,
      title: 'Смартфон Samsung Galaxy S22',
      price: 65000,
      imageUrl: 'assets/images/samsung_galaxy_s22.jpg',
      galleryImages: [
        'assets/images/samsung_galaxy_s22.jpg',
        'assets/images/samsung_galaxy_s22.jpg'
      ],
      location: 'Екатеринбург',
      date: '21 августа 16:03',
      description: 'Samsung Galaxy S22 128 ГБ, черный цвет. Состояние как новый, пленка на экране с завода. Гарантия до марта 2025 года. В комплекте оригинальная коробка, зарядное устройство 25W и силиконовый чехол.'
    },
    {
      id: 7,
      title: 'Компьютер Apple MacBook Pro',
      price: 150000,
      imageUrl: 'assets/images/macbook_pro.jpg',
      galleryImages: [
        'assets/images/macbook_pro.jpg',
        'assets/images/macbook_pro.jpg'
      ],
      location: 'Новосибирск',
      date: '21 августа 16:03',
      description: 'Продается MacBook Pro 13 8/256. Сам ноутбук в отличном состоянии, количество циклов перезарядки 123, в комплекте: коробка, ноутбук, блок, кабель и чек!'
    },
    {
      id: 8,
      title: 'Часы Rolex Submariner',
      price: 350000,
      imageUrl: 'assets/images/rolex_submariner.jpg',
      galleryImages: [
        'assets/images/rolex_submariner.jpg'
      ],
      location: 'Москва',
      date: '21 августа 16:03',
      description: 'Rolex Submariner Date 116610LN, сталь, 40 мм. Производство 2018 года, полный комплект: коробка, документы, сервисная книжка. Состояние коллекционное, только полиролки. Часы проходили ТО в официальном сервисе Rolex в 2023 году.'
    },
    {
      id: 9,
      title: 'Мотоцикл Kawasaki Ninja 2020',
      price: 550000,
      imageUrl: 'assets/images/kawasaki_ninja.jpg',
      galleryImages: [
        'assets/images/kawasaki_ninja.jpg',
        'assets/images/kawasaki_ninja.jpg'
      ],
      location: 'Москва',
      date: '21 августа 14:25',
      description: 'Kawasaki Ninja ZX-10R 2020 года, 204 л.с., пробег 4500 км. Полная комплектация Track Edition: трекшн-контроль, quickshifter, launch control. Обслуживался у официального дилера. В наличии зимние шины и защита.'
    },
    {
      id: 10,
      title: 'Гитара Fender',
      price: 20000,
      imageUrl: 'assets/images/guitar_fender.jpg',
      galleryImages: [
        'assets/images/guitar_fender.jpg',
        'assets/images/guitar_fender.jpg'
      ],
      location: 'Москва',
      date: '21 августа 14:12',
      description: 'Fender Telecaster American Professional II. Производство 2022 года, цвет Olympic White. В отличном состоянии, использовалась редко. В комплекте: кейс Fender, комбоусилитель Fender Mustang LT25.'
    },
    {
      id: 11,
      title: 'Ford Mustang 5.0 AT, 2019, 60 000 км',
      price: 3000000,
      imageUrl: 'assets/images/ford_mustang.jpg',
      galleryImages: [
        'assets/images/ford_mustang.jpg',
        'assets/images/ford_mustang.jpg'
      ],
      location: 'Москва',
      date: '21 августа 19:59',
      description: 'Mustang GT Premium 2019 года, 5.0 V8, 460 л.с. Пробег 60 000 км, один владелец. Полная история обслуживания, все ТО по регламенту. Установлена спортивная выхлопная система Borla. Салон в коже Alcantara.'
    },
    {
      id: 12,
      title: 'iPhone 13 mini, 128 ГБ',
      price: 13900,
      imageUrl: 'assets/images/iphone_13_mini.jpg',
      galleryImages: [
        'assets/images/iphone_13_mini.jpg',
        'assets/images/iphone_13_mini.jpg'
      ],
      location: 'Новосибирск',
      date: '21 августа 10:03',
      description: 'iPhone 13 mini 128 ГБ, звездный свет. Состояние очень хорошее, небольшая потертость на нижней грани. Экран без дефектов, батарея 92% здоровья. В комплекте: оригинальная коробка, зарядное устройство Anker 20W.'
    },
    {
      id: 13,
      title: 'Кофемашина DeLonghi',
      price: 35000,
      imageUrl: 'assets/images/coffee_machine_delonghi.jpg',
      galleryImages: [
        'assets/images/coffee_machine_delonghi.jpg'
      ],
      location: 'Санкт-Петербург',
      date: '21 августа 09:45',
      description: 'DeLonghi Magnifica S ECAM 22.110. Автоматическая кофемашина с возможностью приготовления 2 чашек одновременно. Регулировка помола, 13 степеней крепости. Использовалась 8 месяцев, в отличном состоянии.'
    },
    {
      id: 14,
      title: 'Sony PlayStation 5',
      price: 45000,
      imageUrl: 'assets/images/ps5.jpg',
      galleryImages: [
        'assets/images/ps5.jpg'
      ],
      location: 'Москва',
      date: '21 августа 11:30',
      description: 'PS5 с диско-драйвом, белый цвет. Состояние отличное, использовалась с защитным кожухом. В комплекте: 2 контроллера DualSense, подставка, все оригинальные кабели. Бонусом - подписка PS Plus на 3 месяца.'
    },
    {
      id: 15,
      title: 'Смартфон Samsung Galaxy S22',
      price: 65000,
      imageUrl: 'assets/images/samsung_galaxy_s22.jpg',
      galleryImages: [
        'assets/images/samsung_galaxy_s22.jpg'
      ],
      location: 'Екатеринбург',
      date: '21 августа 15:20',
      description: 'Samsung Galaxy S22+ 256 ГБ, зеленый цвет. Состояние идеальное, используется с защитным стеклом и чехлом. Гарантия до июня 2025 года. В комплекте: коробка, зарядное устройство Samsung 45W, беспроводная зарядка.'
    },
    {
      id: 16,
      title: 'Компьютер Apple MacBook Pro',
      price: 150000,
      imageUrl: 'assets/images/macbook_pro.jpg',
      galleryImages: [
        'assets/images/macbook_pro.jpg'
      ],
      location: 'Новосибирск',
      date: '21 августа 21:15',
      description: 'MacBook Pro 16 M1 Pro, 16/512 ГБ, космический серый. Состояние как новый, использовался только для работы. В комплекте: оригинальная коробка, все аксессуары, чехол. Установлен macOS Sonoma с последними обновлениями.'
    }
  ];

  categories = [
    { label: 'Электроника', value: 'electronics', icon: 'pi pi-mobile' },
    { label: 'Одежда', value: 'clothing', icon: 'pi pi-shopping-bag' },
    { label: 'Мебель', value: 'furniture', icon: 'pi pi-home' },
    { label: 'Транспорт', value: 'transport', icon: 'pi pi-car' }
  ];

  getAdvertisements(): Ad[] {
    return this.advertisements;
  }

  getAdvertisementById(id: number): Ad | null {
    const ads = this.getAdvertisements();
    return ads.find(ad => ad.id === id) || null;
  }
}