let skillsChart = null;

document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
	initTheme();
	initCharts();
	setupMobileMenu();
	setupProjectFiltering();
	setupStaggeredReveals();
	setupScrollAnimations();
});

function initTheme() {
	const savedTheme = localStorage.getItem('theme');
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	const isDark = savedTheme === 'dark' || (savedTheme === null && prefersDark);

	applyTheme(isDark);

	document.querySelectorAll('[data-theme-toggle]').forEach(toggle => {
		toggle.addEventListener('click', toggleTheme);
	});
}

function toggleTheme() {
	const isDark = !document.documentElement.classList.contains('dark');
	applyTheme(isDark);
}

function applyTheme(isDark) {
	document.documentElement.classList.toggle('dark', isDark);
	localStorage.setItem('theme', isDark ? 'dark' : 'light');
	updateThemeToggles(isDark);
	updateChartTheme();
}

function updateThemeToggles(isDark = document.documentElement.classList.contains('dark')) {
	document.querySelectorAll('[data-theme-toggle]').forEach(toggle => {
		toggle.textContent = isDark ? 'Light' : 'Dark';
		toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
		toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
	});
}

function initCharts() {
	const chartElement = document.getElementById('skillsChart');
	if (!chartElement) {
		return;
	}

	const ctx = chartElement.getContext('2d');
	const colors = getChartThemeColors();
	try {
		skillsChart = new Chart(ctx, {
			type: 'radar',
			data: {
				labels: ['Programming', 'AI/ML', 'Web Dev', 'CS Fundamentals', 'Tools', 'Soft Skills'],
				datasets: [{
					label: 'Proficiency Level',
					data: [75, 70, 65, 70, 75, 80],
					backgroundColor: withAlpha(colors.accent, 0.2),
					borderColor: colors.accent,
					pointBackgroundColor: colors.accent,
					pointBorderColor: '#fff',
					pointHoverBackgroundColor: '#fff',
					pointHoverBorderColor: colors.accent
				}]
			},
			options: {
				maintainAspectRatio: false,
				scales: {
					r: {
						angleLines: { display: true, color: colors.grid },
						grid: { color: colors.grid },
						pointLabels: { color: colors.text },
						suggestedMin: 0,
						suggestedMax: 100,
						ticks: { display: false }
					}
				},
				plugins: {
					legend: { display: false }
				}
			}
		});
		updateChartTheme();
	} catch (error) {
		console.error('Chart.js initialization failed:', error);
	}
}

function updateChartTheme() {
	if (!skillsChart) {
		return;
	}

	const colors = getChartThemeColors();
	const dataset = skillsChart.data.datasets[0];

	dataset.borderColor = colors.accent;
	dataset.pointBackgroundColor = colors.accent;
	dataset.pointHoverBorderColor = colors.accent;
	dataset.backgroundColor = withAlpha(colors.accent, 0.2);

	skillsChart.options.scales.r.angleLines.color = colors.grid;
	skillsChart.options.scales.r.grid.color = colors.grid;
	skillsChart.options.scales.r.pointLabels.color = colors.text;

	skillsChart.update();
}

function getChartThemeColors() {
	const styles = getComputedStyle(document.documentElement);
	const accent = styles.getPropertyValue('--accent').trim() || '#d97706';
	const grid = styles.getPropertyValue('--border').trim() || 'rgba(15, 23, 42, 0.12)';
	const text = styles.getPropertyValue('--muted').trim() || '#5f6b75';

	return { accent, grid, text };
}

function withAlpha(color, alpha) {
	if (color.startsWith('#')) {
		let hex = color.replace('#', '');
		if (hex.length === 3) {
			hex = hex.split('').map(char => char + char).join('');
		}
		const value = parseInt(hex, 16);
		const red = (value >> 16) & 255;
		const green = (value >> 8) & 255;
		const blue = value & 255;
		return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
	}

	return color;
}

function setupMobileMenu() {
	const btn = document.getElementById('mobile-menu-btn');
	const menu = document.getElementById('mobile-menu');

	if (!btn || !menu) {
		return;
	}

	const closeMenu = () => {
		menu.classList.add('hidden');
		btn.setAttribute('aria-expanded', 'false');
		btn.textContent = '☰';
	};

	const openMenu = () => {
		menu.classList.remove('hidden');
		btn.setAttribute('aria-expanded', 'true');
		btn.textContent = 'X';
	};

	btn.addEventListener('click', () => {
		if (menu.classList.contains('hidden')) {
			openMenu();
		} else {
			closeMenu();
		}
	});

	menu.querySelectorAll('a').forEach(link => {
		link.addEventListener('click', closeMenu);
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') {
			closeMenu();
		}
	});
}

function filterProjects(category) {
	const cards = document.querySelectorAll('.project-card');
	const buttons = document.querySelectorAll('#projectFilters button');

	buttons.forEach(btn => {
		const isActive = btn.dataset.category === category;
		btn.classList.toggle('filter-btn-active', isActive);
		btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
	});

	cards.forEach(card => {
		const matches = category === 'all' || card.getAttribute('data-category') === category;
		card.style.display = matches ? 'block' : 'none';
	});
}

function setupProjectFiltering() {
	const buttons = document.querySelectorAll('#projectFilters button');

	buttons.forEach(btn => {
		btn.addEventListener('click', () => filterProjects(btn.dataset.category || 'all'));
	});

	filterProjects('all');
}

function setupStaggeredReveals() {
	const elements = document.querySelectorAll('[data-stagger]');
	if (!elements.length) {
		return;
	}

	const groups = {};
	elements.forEach(element => {
		const key = element.dataset.stagger || 'default';
		if (!groups[key]) {
			groups[key] = [];
		}
		groups[key].push(element);
	});

	Object.values(groups).forEach(group => {
		group.forEach((element, index) => {
			const delay = Math.min(index * 0.08, 0.4);
			element.style.transitionDelay = `${delay}s`;
		});
	});
}

function setupScrollAnimations() {
	const elements = document.querySelectorAll('.reveal');
	if (!elements.length) {
		return;
	}

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		elements.forEach(element => element.classList.add('is-visible'));
		return;
	}

	const observer = new IntersectionObserver((entries, obs) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('is-visible');
				obs.unobserve(entry.target);
			}
		});
	}, {
		threshold: 0.15,
		rootMargin: '0px 0px -10% 0px'
	});

	elements.forEach(element => observer.observe(element));
}
